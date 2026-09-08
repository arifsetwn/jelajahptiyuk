import { CapsuleCollider, RigidBody, useBeforePhysicsStep, type RapierRigidBody } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { locations } from "../data/locations";
import { useExperience } from "../store/useExperience";
import { worldSurfaceY } from "../worldGeometry";

const MOVE_SPEED = 7.4;
const SITI_WALIDAH_ID = locations.find((location) => location.kind === "siti-walidah")?.id;
const PLAYER_SPAWN = { x: -19, y: worldSurfaceY(-19, 42) + 1.2, z: 42 };

export function Player() {
  const body = useRef<RapierRigidBody>(null);
  const character = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const walkPhase = useRef(0);
  const isMoving = useRef(false);
  const keys = useRef<Record<string, boolean>>({});
  const lastNearby = useRef<string | null>(null);
  const cameraInitialized = useRef(false);
  const { camera, size } = useThree();
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      keys.current[event.code] = true;
      if (useExperience.getState().started && ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
      }
      if ((event.code === "KeyE" || event.code === "Space") && !event.repeat) {
        const state = useExperience.getState();
        if (state.nearbyLocationId && !state.activeLocationId && !state.mapOpen && !state.helpOpen) {
          event.preventDefault();
          state.openLocation(state.nearbyLocationId);
        }
      }
      if (event.code === "KeyM" && !event.repeat) {
        const state = useExperience.getState();
        if (state.started && !state.activeLocationId) state.setMapOpen(!state.mapOpen);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current[event.code] = false;
    };
    const clearKeys = () => { keys.current = {}; };
    window.addEventListener("blur", clearKeys);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("blur", clearKeys);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Apply input before Rapier steps, including the first step after starting.
  useBeforePhysicsStep(() => {
    const rigidBody = body.current;
    if (!rigidBody) return;

    const state = useExperience.getState();
    const position = rigidBody.translation();
    const paused = !state.started || Boolean(state.activeLocationId || state.mapOpen || state.helpOpen || state.completionOpen);

    let x = 0;
    let z = 0;
    if (!paused) {
      x = Number(Boolean(keys.current.KeyD || keys.current.ArrowRight)) - Number(Boolean(keys.current.KeyA || keys.current.ArrowLeft));
      z = Number(Boolean(keys.current.KeyS || keys.current.ArrowDown)) - Number(Boolean(keys.current.KeyW || keys.current.ArrowUp));
      x += state.moveInput.x;
      z += state.moveInput.z;
    }

    const length = Math.hypot(x, z);
    isMoving.current = length > 0.08;
    if (length > 0.08) {
      x /= Math.max(1, length);
      z /= Math.max(1, length);
      rigidBody.setLinvel({ x: x * MOVE_SPEED, y: 0, z: z * MOVE_SPEED }, true);
      rigidBody.setRotation({ x: 0, y: Math.sin(Math.atan2(x, z) / 2), z: 0, w: Math.cos(Math.atan2(x, z) / 2) }, true);
    } else {
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    const surfaceY = worldSurfaceY(position.x, position.z) + 1.2;
    if (Math.abs(position.y - surfaceY) > 0.015) {
      rigidBody.setTranslation({ x: position.x, y: surfaceY, z: position.z }, true);
    }

    if (Math.hypot(position.x, position.z) > 48.5 || position.y < -26) {
      rigidBody.setTranslation(PLAYER_SPAWN, true);
      rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  useFrame((_, delta) => {
    const rigidBody = body.current;
    if (!rigidBody) return;
    const state = useExperience.getState();
    const position = rigidBody.translation();

    const animationSpeed = 1 - Math.pow(0.0001, delta);
    if (isMoving.current) walkPhase.current += delta * 9;
    const swing = isMoving.current ? Math.sin(walkPhase.current) * 0.62 : 0;
    const oppositeSwing = -swing;
    if (leftArm.current) leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, oppositeSwing, animationSpeed);
    if (rightArm.current) rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, swing, animationSpeed);
    if (leftLeg.current) leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, swing, animationSpeed);
    if (rightLeg.current) rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, oppositeSwing, animationSpeed);
    if (character.current) {
      const bob = isMoving.current ? Math.abs(Math.sin(walkPhase.current * 2)) * 0.045 : 0;
      character.current.position.y = THREE.MathUtils.lerp(character.current.position.y, -0.5 + bob, animationSpeed);
      character.current.rotation.z = THREE.MathUtils.lerp(
        character.current.rotation.z,
        isMoving.current ? Math.sin(walkPhase.current) * 0.025 : 0,
        animationSpeed,
      );
    }

    let nearestId: string | null = null;
    let nearestDistance = 5.5;
    for (const location of locations) {
      const interactionZ = location.position[2] + (location.kind === "edutorium" ? 7.8 : location.kind === "lakeside" ? 8 : location.kind === "siti-walidah" ? 9.4 : location.kind === "hospital" ? 4.7 : location.kind === "pti-office" ? 3 : location.kind === "medical-center" ? 3 : 0);
      const distance = Math.hypot(position.x - location.position[0], position.z - interactionZ);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestId = location.id;
      }
    }
    if (nearestId !== lastNearby.current) {
      lastNearby.current = nearestId;
      state.setNearbyLocation(nearestId);
    }

    if (state.cameraMode === "overview") {
      cameraTarget.set(0, 78, 76);
      lookTarget.set(0, -6, 0);
    } else {
      const framingTallLandmark = nearestId === SITI_WALIDAH_ID;
      const narrowViewport = size.width / size.height < 0.82;
      const heightOffset = state.cameraHeight + (narrowViewport ? 3 : 0) + (framingTallLandmark ? 4 : 0);
      const distanceZ = narrowViewport
        ? (framingTallLandmark ? 25 : 21)
        : (framingTallLandmark ? 21 : 17);
      const offsetX = narrowViewport
        ? (framingTallLandmark ? 4 : 2)
        : (framingTallLandmark ? 7 : 5);

      cameraTarget.set(
        position.x + offsetX,
        position.y + heightOffset,
        position.z + distanceZ,
      );
      lookTarget.set(
        position.x,
        position.y + (framingTallLandmark ? 2.8 : 1.3),
        position.z - (narrowViewport ? 2 : 3.5),
      );
    }

    if (!cameraInitialized.current) {
      camera.position.copy(cameraTarget);
      camera.lookAt(lookTarget);
      cameraInitialized.current = true;
    } else {
      camera.position.lerp(cameraTarget, 1 - Math.pow(0.001, delta));
      camera.lookAt(lookTarget);
    }
  });

  return (
    <RigidBody
      ref={body}
      position={[PLAYER_SPAWN.x, PLAYER_SPAWN.y, PLAYER_SPAWN.z]}
      rotation={[0, Math.PI, 0]}
      colliders={false}
      enabledRotations={[false, true, false]}
      linearDamping={8}
      angularDamping={8}
      canSleep={false}
      gravityScale={0}
    >
      <CapsuleCollider args={[0.42, 0.38]} position={[0, 0.12, 0]} />
      <group ref={character} position={[0, -0.5, 0]}>
        <mesh position={[0, 1.72, 0]} castShadow>
          <sphereGeometry args={[0.35, 12, 8]} />
          <meshStandardMaterial color="#d99d75" flatShading />
        </mesh>

        <mesh position={[0, 1.91, -0.025]} scale={[1.02, 0.58, 1.02]} castShadow>
          <sphereGeometry args={[0.36, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#20283a" flatShading />
        </mesh>
        <mesh position={[-0.22, 1.92, 0.03]} rotation={[0.1, 0, 0.35]} castShadow>
          <coneGeometry args={[0.13, 0.34, 6]} />
          <meshStandardMaterial color="#20283a" flatShading />
        </mesh>
        <mesh position={[0.1, 1.96, 0.02]} rotation={[-0.1, 0, -0.25]} castShadow>
          <coneGeometry args={[0.12, 0.32, 6]} />
          <meshStandardMaterial color="#20283a" flatShading />
        </mesh>

        <mesh position={[0, 2.055, 0]} scale={[1.08, 0.52, 1.08]} castShadow>
          <sphereGeometry args={[0.39, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#13a9b7" flatShading />
        </mesh>
        <mesh position={[0, 2.025, 0.31]} castShadow>
          <boxGeometry args={[0.48, 0.07, 0.34]} />
          <meshStandardMaterial color="#0f98a8" flatShading />
        </mesh>

        <group position={[0, 1.74, 0.325]}>
          <mesh position={[-0.14, 0.04, 0]}>
            <torusGeometry args={[0.105, 0.018, 6, 12]} />
            <meshStandardMaterial color="#1b2433" />
          </mesh>
          <mesh position={[0.14, 0.04, 0]}>
            <torusGeometry args={[0.105, 0.018, 6, 12]} />
            <meshStandardMaterial color="#1b2433" />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.08, 0.018, 0.018]} />
            <meshStandardMaterial color="#1b2433" />
          </mesh>
        </group>

        <mesh position={[0, 1.08, 0]} scale={[1, 1.08, 0.74]} castShadow>
          <capsuleGeometry args={[0.39, 0.48, 4, 8]} />
          <meshStandardMaterial color="#13a9b7" flatShading />
        </mesh>
        <mesh position={[0, 1.08, 0.292]} castShadow>
          <boxGeometry args={[0.25, 0.76, 0.08]} />
          <meshStandardMaterial color="#f1f1ec" roughness={0.9} />
        </mesh>
        <mesh position={[-0.13, 1.2, 0.34]} rotation={[0, 0, -0.16]} castShadow>
          <coneGeometry args={[0.16, 0.55, 3]} />
          <meshStandardMaterial color="#f1f1ec" />
        </mesh>
        <mesh position={[0.13, 1.2, 0.34]} rotation={[0, 0, 0.16]} castShadow>
          <coneGeometry args={[0.16, 0.55, 3]} />
          <meshStandardMaterial color="#f1f1ec" />
        </mesh>

        <group ref={leftArm} position={[-0.48, 1.34, 0]} rotation={[0, 0, -0.12]}>
          <mesh position={[0, -0.39, 0]} castShadow>
            <capsuleGeometry args={[0.14, 0.52, 4, 7]} />
            <meshStandardMaterial color="#13a9b7" flatShading />
          </mesh>
          <mesh position={[0, -0.78, 0]} castShadow>
            <sphereGeometry args={[0.145, 8, 6]} />
            <meshStandardMaterial color="#d99d75" flatShading />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.48, 1.34, 0]} rotation={[0, 0, 0.12]}>
          <mesh position={[0, -0.39, 0]} castShadow>
            <capsuleGeometry args={[0.14, 0.52, 4, 7]} />
            <meshStandardMaterial color="#13a9b7" flatShading />
          </mesh>
          <mesh position={[0, -0.78, 0]} castShadow>
            <sphereGeometry args={[0.145, 8, 6]} />
            <meshStandardMaterial color="#d99d75" flatShading />
          </mesh>
        </group>

        <group ref={leftLeg} position={[-0.21, 0.68, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <capsuleGeometry args={[0.16, 0.52, 4, 7]} />
            <meshStandardMaterial color="#c8b99d" flatShading />
          </mesh>
          <mesh position={[0, -0.75, 0.08]} scale={[1, 0.62, 1.52]} castShadow>
            <sphereGeometry args={[0.2, 8, 6]} />
            <meshStandardMaterial color="#eeeef0" flatShading />
          </mesh>
        </group>
        <group ref={rightLeg} position={[0.21, 0.68, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <capsuleGeometry args={[0.16, 0.52, 4, 7]} />
            <meshStandardMaterial color="#c8b99d" flatShading />
          </mesh>
          <mesh position={[0, -0.75, 0.08]} scale={[1, 0.62, 1.52]} castShadow>
            <sphereGeometry args={[0.2, 8, 6]} />
            <meshStandardMaterial color="#eeeef0" flatShading />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
}
