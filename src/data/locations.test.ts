import { describe, expect, it } from "vitest";
import { getLocation, locations } from "./locations";

describe("campus locations", () => {
  it("contains eleven uniquely identified locations", () => {
    expect(locations).toHaveLength(11);
    expect(new Set(locations.map((location) => location.id)).size).toBe(11);
    expect(locations.map((location) => location.id).sort()).toEqual([
      "L01", "L02", "L03", "L04", "L05", "L06", "L07", "L08", "L09", "L10", "L11",
    ]);
  });

  it("contains four PTI locations and seven UMS landmarks", () => {
    expect(locations.filter((location) => location.category === "pti_fkip")).toHaveLength(4);
    expect(locations.filter((location) => location.category === "landmark_ums")).toHaveLength(7);
  });

  it("groups locations into the three required campus areas", () => {
    expect(locations.filter((location) => location.campusArea === "kampus_1")).toHaveLength(6);
    expect(locations.filter((location) => location.campusArea === "kampus_2")).toHaveLength(4);
    expect(locations.filter((location) => location.campusArea === "edutorium")).toHaveLength(1);
  });

  it("resolves a location by id and rejects an unknown id", () => {
    expect(getLocation("L02")?.slug).toBe("gedung-b");
    expect(getLocation("unknown")).toBeNull();
    expect(getLocation(null)).toBeNull();
  });
});
