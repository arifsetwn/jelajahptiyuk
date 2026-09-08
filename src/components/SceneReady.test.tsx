// @vitest-environment jsdom
import { act, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { SceneReady } from "./SceneReady";
import { useExperience } from "../store/useExperience";

const frames = vi.hoisted(() => new Set<() => void>());
vi.mock("@react-three/fiber", async () => {
  const { useEffect } = await import("react");
  return {
    useFrame: (callback: () => void) => {
      useEffect(() => {
        frames.add(callback);
        return () => { frames.delete(callback); };
      }, [callback]);
    },
  };
});

it("blocks starting during Suspense and until a world frame has rendered, then resets on unmount", async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  useExperience.setState({ assetsLoaded: false, started: false, helpOpen: false });
  let loaded = false;
  let resolve!: () => void;
  const loading = new Promise<void>((done) => { resolve = done; });
  function World() {
    if (!loaded) throw loading;
    return <SceneReady />;
  }
  const root = createRoot(document.createElement("div"));
  try {
    await act(async () => {
      root.render(<StrictMode><Suspense fallback={null}><World /></Suspense></StrictMode>);
    });
    expect(frames.size).toBe(0);
    useExperience.getState().start();
    expect(useExperience.getState().started).toBe(false);

    await act(async () => { loaded = true; resolve(); await loading; });
    expect(frames.size).toBe(1);
    expect(useExperience.getState().assetsLoaded).toBe(false);
    act(() => { frames.forEach((frame) => frame()); });
    useExperience.getState().start();
    expect(useExperience.getState().started).toBe(false);

    act(() => { frames.forEach((frame) => frame()); });
    expect(useExperience.getState().assetsLoaded).toBe(true);
    useExperience.getState().start();
    expect(useExperience.getState().started).toBe(true);
    expect(useExperience.getState().helpOpen).toBe(true);
  } finally {
    await act(async () => root.unmount());
  }
  expect(useExperience.getState().assetsLoaded).toBe(false);
  expect(frames.size).toBe(0);
});
