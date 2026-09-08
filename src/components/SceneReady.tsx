import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useExperience } from "../store/useExperience";

// Mount inside Physics and Suspense so Rapier and the world are ready first.
export function SceneReady() {
  const mounted = useRef(false);
  const rendered = useRef(false);

  useEffect(() => {
    mounted.current = true;
    rendered.current = false;
    useExperience.getState().setAssetsLoaded(false);
    return () => {
      mounted.current = false;
      useExperience.getState().setAssetsLoaded(false);
    };
  }, []);

  useFrame(() => {
    if (!mounted.current) return;
    // useFrame runs before rendering. Wait until the following frame to
    // acknowledge that the committed world has actually been rendered.
    if (rendered.current) {
      if (!useExperience.getState().assetsLoaded) {
        useExperience.getState().setAssetsLoaded(true);
      }
    } else {
      rendered.current = true;
    }
  });

  return null;
}
