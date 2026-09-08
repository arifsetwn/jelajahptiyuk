import * as THREE from "three";
import { worldSurfaceY } from "../worldGeometry";

export interface RoadDefinition {
  startX: number;
  startZ: number;
  endX: number;
  endZ: number;
  width: number;
}

export const CAMPUS_ROADS: RoadDefinition[] = [
  // 1. South horizontal road (Kampus 1 & 2 cross-connector)
  { startX: -46, startZ: 10, endX: 46, endZ: 10, width: 6 },
  // 2. West vertical road (through Gerbang Kampus 1 past Bookstore, Gedung B, C, E)
  { startX: -19, startZ: 42, endX: -19, endZ: -42, width: 5.5 },
  // 3. East vertical road (Kampus 2 past Siti Walidah, Library, Lake, Masjid Sudalmiyah)
  { startX: 19, startZ: 41, endX: 19, endZ: -43, width: 5.5 },
  // 4. North horizontal road (past Edutorium)
  { startX: -38, startZ: -23, endX: 38, endZ: -23, width: 5.5 },
];

export const ROAD_INTERSECTIONS: Array<[number, number]> = [
  [-19, 10],
  [19, 10],
  [-19, -23],
  [19, -23],
];

export function createCurvedRoadGeometry(
  startX: number,
  startZ: number,
  endX: number,
  endZ: number,
  width: number,
  stepLength = 0.75,
  roadElevation = 0.08,
  curbDepth = 0.4,
) {
  const dx = endX - startX;
  const dz = endZ - startZ;
  const totalLength = Math.hypot(dx, dz);
  const dirX = dx / totalLength;
  const dirZ = dz / totalLength;
  const normX = -dirZ;
  const normZ = dirX;

  const segmentCount = Math.max(8, Math.ceil(totalLength / stepLength));
  const positions: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segmentCount; i++) {
    const t = i / segmentCount;
    const cx = startX + dirX * totalLength * t;
    const cz = startZ + dirZ * totalLength * t;

    const lx = cx + normX * (width / 2);
    const lz = cz + normZ * (width / 2);
    const ly = worldSurfaceY(lx, lz) + roadElevation;
    const lyBottom = worldSurfaceY(lx, lz) - curbDepth;

    const rx = cx - normX * (width / 2);
    const rz = cz - normZ * (width / 2);
    const ry = worldSurfaceY(rx, rz) + roadElevation;
    const ryBottom = worldSurfaceY(rx, rz) - curbDepth;

    // 0: LT, 1: RT, 2: LB, 3: RB
    positions.push(lx, ly, lz);
    positions.push(rx, ry, rz);
    positions.push(lx, lyBottom, lz);
    positions.push(rx, ryBottom, rz);

    if (i < segmentCount) {
      const curr = i * 4;
      const next = (i + 1) * 4;

      // Top surface
      indices.push(curr + 0, next + 0, curr + 1);
      indices.push(curr + 1, next + 0, next + 1);

      // Left skirt
      indices.push(curr + 0, curr + 2, next + 0);
      indices.push(next + 0, curr + 2, next + 2);

      // Right skirt
      indices.push(curr + 1, next + 1, curr + 3);
      indices.push(next + 1, next + 3, curr + 3);
    }
  }

  // Start cap
  indices.push(0, 1, 2);
  indices.push(1, 3, 2);
  // End cap
  const last = segmentCount * 4;
  indices.push(last + 0, last + 2, last + 1);
  indices.push(last + 1, last + 2, last + 3);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createCurvedRoadMarkings(
  startX: number,
  startZ: number,
  endX: number,
  endZ: number,
  roadElevation = 0.08,
) {
  const dx = endX - startX;
  const dz = endZ - startZ;
  const totalLength = Math.hypot(dx, dz);
  const dirX = dx / totalLength;
  const dirZ = dz / totalLength;
  const normX = -dirZ;
  const normZ = dirX;

  const dashLength = 1.6;
  const dashSpacing = 1.6;
  const period = dashLength + dashSpacing;
  const dashWidth = 0.18;

  const positions: number[] = [];
  const indices: number[] = [];
  let vertOffset = 0;

  for (let s = 1.2; s + dashLength <= totalLength - 1.0; s += period) {
    const midT = (s + dashLength / 2) / totalLength;
    const midX = startX + dirX * totalLength * midT;
    const midZ = startZ + dirZ * totalLength * midT;

    // Skip dashed markings inside road intersections
    const inIntersection = ROAD_INTERSECTIONS.some(
      ([ix, iz]) => Math.hypot(midX - ix, midZ - iz) < 3.8,
    );
    if (inIntersection) continue;

    // 2 segments for the dash to hug curvature cleanly
    const dashSteps = 2;
    for (let j = 0; j <= dashSteps; j++) {
      const subT = (s + (dashLength * j) / dashSteps) / totalLength;
      const cx = startX + dirX * totalLength * subT;
      const cz = startZ + dirZ * totalLength * subT;
      const y = worldSurfaceY(cx, cz) + roadElevation + 0.015;

      const lx = cx + normX * (dashWidth / 2);
      const lz = cz + normZ * (dashWidth / 2);
      const rx = cx - normX * (dashWidth / 2);
      const rz = cz - normZ * (dashWidth / 2);

      positions.push(lx, y, lz);
      positions.push(rx, y, rz);
    }

    for (let j = 0; j < dashSteps; j++) {
      const curr = vertOffset + j * 2;
      const next = curr + 2;
      indices.push(curr + 0, next + 0, curr + 1);
      indices.push(curr + 1, next + 0, next + 1);
    }
    vertOffset += (dashSteps + 1) * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
