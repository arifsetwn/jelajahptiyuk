import { describe, it, expect } from "vitest";
import { CAMPUS_ROADS, createCurvedRoadGeometry, createCurvedRoadMarkings } from "./curvedRoad";

describe("curvedRoad generator", () => {
  it("should create seamless road geometries for all campus roads", () => {
    for (const road of CAMPUS_ROADS) {
      const geo = createCurvedRoadGeometry(road.startX, road.startZ, road.endX, road.endZ, road.width);
      expect(geo.getAttribute("position")).toBeDefined();
      expect(geo.getIndex()).toBeDefined();
      expect(geo.getAttribute("position").count).toBeGreaterThan(32);
      expect(geo.getIndex()?.count).toBeGreaterThan(60);
    }
  });

  it("should create yellow dashed road markings", () => {
    const geo = createCurvedRoadMarkings(-19, 42, -19, -42);
    expect(geo.getAttribute("position").count).toBeGreaterThan(0);
    expect(geo.getIndex()?.count).toBeGreaterThan(0);
  });
});
