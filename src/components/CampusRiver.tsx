import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { worldSurfaceTilt, worldSurfaceY } from "../worldGeometry";

const riverZ = (x: number) => 33 + Math.sin(x * 0.085) * 1.55;
const RIVER_MIN_X = -40;
const RIVER_MAX_X = 40;
const RIVER_LENGTH = RIVER_MAX_X - RIVER_MIN_X;

function createRiverGeometry() {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const indices: number[] = [];
  const segments = 72;
  const halfWidth = 1.65;
  for (let index = 0; index <= segments; index += 1) {
    const progress = index / segments;
    const x = RIVER_MIN_X + RIVER_LENGTH * progress;
    const z = riverZ(x);
    const edgeTaper = Math.min(1, Math.sin(progress * Math.PI) * 5);
    const taperedHalfWidth = Math.max(0.08, halfWidth * edgeTaper);
    positions.push(x, worldSurfaceY(x, z - taperedHalfWidth) + 0.13, z - taperedHalfWidth);
    positions.push(x, worldSurfaceY(x, z + taperedHalfWidth) + 0.13, z + taperedHalfWidth);
    if (index < segments) {
      const offset = index * 2;
      indices.push(offset, offset + 2, offset + 1, offset + 1, offset + 2, offset + 3);
    }
  }
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function FlowHighlights() {
  const highlights = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    highlights.current?.children.forEach((child, index) => {
      const x = ((clock.elapsedTime * (1.25 + index * 0.08) + index * 13 - RIVER_MIN_X) % RIVER_LENGTH) + RIVER_MIN_X;
      const z = riverZ(x) + (index % 2 === 0 ? -0.55 : 0.55);
      child.position.set(x, worldSurfaceY(x, z) + 0.17, z);
    });
  });
  return (
    <group ref={highlights}>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.8, 0.09]} />
          <meshBasicMaterial color="#d9f4f2" transparent opacity={0.58} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function RiverBridge({ x }: { x: number }) {
  const z = riverZ(x);
  return (
    <group position={[x, worldSurfaceY(x, z) + 0.2, z]} rotation={worldSurfaceTilt(x, z)}>
      <mesh receiveShadow castShadow><boxGeometry args={[5.45, 0.28, 5.7]} /><meshStandardMaterial color="#788187" roughness={0.88} /></mesh>
      <mesh position={[0, 0.17, 0]} receiveShadow><boxGeometry args={[0.17, 0.05, 5.75]} /><meshStandardMaterial color="#f1ce55" /></mesh>
      {[-2.62, 2.62].map((side) => (
        <group key={side} position={[side, 0, 0]}>
          <mesh position={[0, 0.68, 0]} castShadow><boxGeometry args={[0.1, 0.1, 5.75]} /><meshStandardMaterial color="#ece9dc" /></mesh>
          {[-2.55, -1.25, 0, 1.25, 2.55].map((postZ) => (
            <mesh key={postZ} position={[0, 0.38, postZ]} castShadow><boxGeometry args={[0.1, 0.76, 0.1]} /><meshStandardMaterial color="#ece9dc" /></mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function FishingNpc() {
  const rod = useRef<THREE.Group>(null);
  const bobber = useRef<THREE.Mesh>(null);
  const x = 23;
  const z = riverZ(x) - 2.45;
  useFrame(({ clock }) => {
    if (rod.current) rod.current.rotation.x = -0.34 + Math.sin(clock.elapsedTime * 1.2) * 0.035;
    if (bobber.current) bobber.current.position.y = Math.sin(clock.elapsedTime * 2.4) * 0.035;
  });
  return (
    <group position={[x, worldSurfaceY(x, z), z]} rotation={worldSurfaceTilt(x, z)}>
      <mesh position={[0, 0.38, -0.1]} castShadow><boxGeometry args={[1.2, 0.22, 0.48]} /><meshStandardMaterial color="#8b5c3f" /></mesh>
      <mesh position={[0, 1.25, 0]} castShadow><boxGeometry args={[0.62, 0.84, 0.4]} /><meshStandardMaterial color="#e2a943" flatShading /></mesh>
      <mesh position={[0, 1.82, 0.05]} castShadow><sphereGeometry args={[0.27, 10, 7]} /><meshStandardMaterial color="#bd835e" flatShading /></mesh>
      <mesh position={[0, 2.02, 0.05]} scale={[1.1, 0.48, 1.05]} castShadow><sphereGeometry args={[0.3, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#315d88" flatShading /></mesh>
      {[-0.2, 0.2].map((legX) => (
        <mesh key={legX} position={[legX, 0.75, 0.42]} rotation={[-0.7, 0, 0]} castShadow><boxGeometry args={[0.2, 0.75, 0.22]} /><meshStandardMaterial color="#344e68" flatShading /></mesh>
      ))}
      <group ref={rod} position={[0.32, 1.46, 0.25]} rotation={[-0.34, 0, -0.14]}>
        <mesh position={[0, 1.5, 0]} castShadow><cylinderGeometry args={[0.025, 0.045, 3, 7]} /><meshStandardMaterial color="#65442f" /></mesh>
        <mesh position={[0, 3, 1.2]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 2.4, 5]} /><meshBasicMaterial color="#d9e0dc" transparent opacity={0.75} /></mesh>
      </group>
      <mesh ref={bobber} position={[0.32, 0.22, 3.75]} castShadow><sphereGeometry args={[0.08, 8, 6]} /><meshStandardMaterial color="#e34b48" /></mesh>
    </group>
  );
}

export function CampusRiver() {
  const geometry = useMemo(createRiverGeometry, []);
  return (
    <group>
      <mesh geometry={geometry} receiveShadow><meshStandardMaterial color="#51a9bd" roughness={0.32} metalness={0.04} side={THREE.DoubleSide} /></mesh>
      <FlowHighlights />
      <RiverBridge x={-19} />
      <RiverBridge x={19} />
      <FishingNpc />
    </group>
  );
}
