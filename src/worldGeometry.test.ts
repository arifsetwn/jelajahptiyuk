import { describe, expect, it } from "vitest";
import { worldSurfaceNormal, worldSurfaceY } from "./worldGeometry";

describe("worldSurfaceNormal", () => {
  it("points straight up at the center of the world", () => {
    expect(worldSurfaceNormal(0, 0)).toEqual([0, 1, 0]);
  });

  it("is normalized and perpendicular to both local surface tangents", () => {
    const x = 37;
    const z = 11;
    const step = 0.001;
    const normal = worldSurfaceNormal(x, z);
    const tangentX = [2 * step, worldSurfaceY(x + step, z) - worldSurfaceY(x - step, z), 0];
    const tangentZ = [0, worldSurfaceY(x, z + step) - worldSurfaceY(x, z - step), 2 * step];
    const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

    expect(Math.hypot(...normal)).toBeCloseTo(1, 8);
    expect(dot(normal, tangentX)).toBeCloseTo(0, 8);
    expect(dot(normal, tangentZ)).toBeCloseTo(0, 8);
  });
});
