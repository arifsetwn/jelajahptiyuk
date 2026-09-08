// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { locations } from "../data/locations";
import { useExperience } from "./useExperience";

describe("experience progress", () => {
  beforeEach(() => {
    localStorage.clear();
    useExperience.setState({
      activeLocationId: null,
      visitedLocationIds: [],
      completionOpen: false,
      nearbyLocationId: null,
    });
  });

  it("records a location only once", () => {
    useExperience.getState().openLocation("L01");
    useExperience.getState().openLocation("L01");
    expect(useExperience.getState().visitedLocationIds).toEqual(["L01"]);
  });

  it("opens completion after the final location modal closes", () => {
    for (const location of locations) useExperience.getState().openLocation(location.id);
    expect(useExperience.getState().visitedLocationIds).toHaveLength(11);
    useExperience.getState().closeLocation();
    expect(useExperience.getState().completionOpen).toBe(true);
  });

  it("resets only visit progress", () => {
    useExperience.setState({ visitedLocationIds: ["L01", "L02"], soundEnabled: true, quality: "light" });
    useExperience.getState().resetProgress();
    expect(useExperience.getState().visitedLocationIds).toEqual([]);
    expect(useExperience.getState().soundEnabled).toBe(true);
    expect(useExperience.getState().quality).toBe("light");
  });
});
