import { create } from "zustand";
import { persist } from "zustand/middleware";
import { locations } from "../data/locations";
import type { CameraMode, GraphicsQuality } from "../types";

interface MoveInput {
  x: number;
  z: number;
}

interface ExperienceState {
  started: boolean;
  activeLocationId: string | null;
  nearbyLocationId: string | null;
  visitedLocationIds: string[];
  mapOpen: boolean;
  helpOpen: boolean;
  completionOpen: boolean;
  soundEnabled: boolean;
  quality: GraphicsQuality;
  cameraMode: CameraMode;
  cameraHeight: number;
  moveInput: MoveInput;
  assetsLoaded: boolean;
  setAssetsLoaded: (loaded: boolean) => void;
  start: () => void;
  setNearbyLocation: (id: string | null) => void;
  openLocation: (id: string) => void;
  closeLocation: () => void;
  setMapOpen: (open: boolean) => void;
  setHelpOpen: (open: boolean) => void;
  setCompletionOpen: (open: boolean) => void;
  toggleSound: () => void;
  toggleQuality: () => void;
  toggleCamera: () => void;
  setCameraHeight: (height: number) => void;
  setMoveInput: (input: MoveInput) => void;
  resetProgress: () => void;
}

export const useExperience = create<ExperienceState>()(
  persist(
    (set, get) => ({
      started: false,
      activeLocationId: null,
      nearbyLocationId: null,
      visitedLocationIds: [],
      mapOpen: false,
      helpOpen: false,
      completionOpen: false,
      soundEnabled: false,
      quality: "detail",
      cameraMode: "follow",
      cameraHeight: 18,
      moveInput: { x: 0, z: 0 },
      assetsLoaded: false,
      setAssetsLoaded: (loaded) => set({ assetsLoaded: loaded }),
      start: () => {
        if (get().assetsLoaded) set({ started: true, helpOpen: true });
      },
      setNearbyLocation: (id) => {
        if (get().nearbyLocationId !== id) set({ nearbyLocationId: id });
      },
      openLocation: (id) => {
        const visited = get().visitedLocationIds;
        set({
          activeLocationId: id,
          mapOpen: false,
          visitedLocationIds: visited.includes(id) ? visited : [...visited, id],
        });
      },
      closeLocation: () => {
        const complete = get().visitedLocationIds.length === locations.length;
        set({ activeLocationId: null, completionOpen: complete });
      },
      setMapOpen: (open) => set({ mapOpen: open, helpOpen: false }),
      setHelpOpen: (open) => set({ helpOpen: open, mapOpen: false }),
      setCompletionOpen: (open) => set({ completionOpen: open }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleQuality: () =>
        set((state) => ({ quality: state.quality === "detail" ? "light" : "detail" })),
      toggleCamera: () =>
        set((state) => ({ cameraMode: state.cameraMode === "follow" ? "overview" : "follow" })),
      setCameraHeight: (height) => set({ cameraHeight: Math.min(30, Math.max(12, height)) }),
      setMoveInput: (input) => set({ moveInput: input }),
      resetProgress: () => set({ visitedLocationIds: [], completionOpen: false }),
    }),
    {
      name: "jelajah-pti-ums-progress-v2",
      partialize: (state) => ({
        visitedLocationIds: state.visitedLocationIds,
        soundEnabled: state.soundEnabled,
        quality: state.quality,
        cameraHeight: state.cameraHeight,
      }),
    },
  ),
);
