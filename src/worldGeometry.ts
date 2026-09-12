export const WORLD_RADIUS = 52;
export const WORLD_VERTICAL_RADIUS = 22.5;
export const WORLD_CENTER_Y = -WORLD_VERTICAL_RADIUS;

const safeRadialRatio = (x: number, z: number) =>
  Math.min(0.985, (x * x + z * z) / (WORLD_RADIUS * WORLD_RADIUS));

export function worldSurfaceY(x: number, z: number) {
  return WORLD_VERTICAL_RADIUS * (Math.sqrt(1 - safeRadialRatio(x, z)) - 1);
}

export function worldSurfaceNormal(x: number, z: number): [number, number, number] {
  const root = Math.sqrt(1 - safeRadialRatio(x, z));
  const slopeX = -(WORLD_VERTICAL_RADIUS * x) / (WORLD_RADIUS * WORLD_RADIUS * root);
  const slopeZ = -(WORLD_VERTICAL_RADIUS * z) / (WORLD_RADIUS * WORLD_RADIUS * root);
  const length = Math.hypot(slopeX, 1, slopeZ);

  return [-slopeX / length, 1 / length, -slopeZ / length];
}

export function worldSurfaceTilt(x: number, z: number): [number, number, number] {
  const root = Math.sqrt(1 - safeRadialRatio(x, z));
  const slopeX = -(WORLD_VERTICAL_RADIUS * x) / (WORLD_RADIUS * WORLD_RADIUS * root);
  const slopeZ = -(WORLD_VERTICAL_RADIUS * z) / (WORLD_RADIUS * WORLD_RADIUS * root);

  return [-Math.atan(slopeZ), 0, Math.atan(slopeX)];
}
