// @vitest-environment jsdom
import { act, useLayoutEffect, type RefObject } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import RAPIER from "@dimforge/rapier3d-compat";
import { PerspectiveCamera } from "three";
import { Player } from "./Player";
import { useExperience } from "../store/useExperience";

const simulation = vi.hoisted(() => ({
  beforeStep: undefined as (() => void) | undefined,
  body: null as unknown as RAPIER.RigidBody,
}));

vi.mock("@react-three/fiber", () => ({
  useFrame: () => {},
  useThree: () => ({ camera: new PerspectiveCamera(), size: { width: 1280, height: 720 } }),
}));
vi.mock("@react-three/rapier", () => ({
  useBeforePhysicsStep: (callback: () => void) => { simulation.beforeStep = callback; },
  RigidBody: ({ ref }: { ref: RefObject<RAPIER.RigidBody | null> }) => {
    useLayoutEffect(() => {
      ref.current = simulation.body;
      return () => { ref.current = null; };
    }, [ref]);
    return null;
  },
  CapsuleCollider: () => null,
}));

let world: RAPIER.World;
let root: ReturnType<typeof createRoot>;

beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  await RAPIER.init();
  world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  simulation.body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(-19, 0, 42).setCanSleep(false));
  world.createCollider(RAPIER.ColliderDesc.capsule(0.42, 0.38), simulation.body);
  useExperience.setState({
    started: false, assetsLoaded: true, helpOpen: false, mapOpen: false,
    completionOpen: false, activeLocationId: null, moveInput: { x: 0, z: 0 },
  });
  root = createRoot(document.createElement("div"));
  await act(async () => root.render(<Player />));
});

afterEach(async () => {
  await act(async () => root.unmount());
  world.free();
});

function step() {
  simulation.beforeStep!();
  world.timestep = 1 / 60;
  world.step();
}

it.each([
  ["KeyW", "z", -1], ["KeyS", "z", 1],
  ["KeyA", "x", -1], ["KeyD", "x", 1],
  ["ArrowUp", "z", -1], ["ArrowDown", "z", 1],
  ["ArrowLeft", "x", -1], ["ArrowRight", "x", 1],
] as const)("moves on the very first physics step after starting with %s", (code, axis, direction) => {
  useExperience.getState().start();
  useExperience.getState().setHelpOpen(false);
  const initial = simulation.body.translation()[axis];
  window.dispatchEvent(new KeyboardEvent("keydown", { code }));
  step();
  expect((simulation.body.translation()[axis] - initial) * direction).toBeGreaterThan(0);
  window.dispatchEvent(new KeyboardEvent("keyup", { code }));
  step();
  expect(simulation.body.linvel()[axis]).toBe(0);
});

it("still pauses for help and resumes immediately when it closes", () => {
  useExperience.getState().start();
  useExperience.getState().setHelpOpen(true);
  window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
  step();
  expect(simulation.body.linvel().z).toBe(0);
  useExperience.getState().setHelpOpen(false);
  step();
  expect(simulation.body.linvel().z).toBeLessThan(0);
  window.dispatchEvent(new Event("blur"));
  step();
  expect(simulation.body.linvel().z).toBe(0);
});

it("accepts touch input before any keyboard key has been pressed", () => {
  useExperience.getState().start();
  useExperience.getState().setHelpOpen(false);
  useExperience.getState().setMoveInput({ x: 1, z: 0 });
  step();
  expect(simulation.body.linvel().x).toBeGreaterThan(0);
  expect(simulation.body.linvel().z).toBe(0);
});
