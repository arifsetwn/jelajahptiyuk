import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody, type RapierRigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { worldSurfaceNormal, worldSurfaceTilt, worldSurfaceY } from "../worldGeometry";

const vehicleUp = new THREE.Vector3();
const vehicleForward = new THREE.Vector3();
const vehicleRight = new THREE.Vector3();
const vehicleBasis = new THREE.Matrix4();

function setVehicleSurfaceRotation(
  target: THREE.Quaternion,
  x: number,
  z: number,
  directionX: number,
  directionZ: number,
) {
  const [normalX, normalY, normalZ] = worldSurfaceNormal(x, z);
  vehicleUp.set(normalX, normalY, normalZ);
  vehicleForward.set(directionX, 0, directionZ).normalize();
  vehicleForward.addScaledVector(vehicleUp, -vehicleForward.dot(vehicleUp)).normalize();
  vehicleRight.crossVectors(vehicleUp, vehicleForward).normalize();
  vehicleForward.crossVectors(vehicleRight, vehicleUp).normalize();
  vehicleBasis.makeBasis(vehicleRight, vehicleUp, vehicleForward);
  target.setFromRotationMatrix(vehicleBasis);
}

function Bird({ radius, height, speed, phase }: { radius: number; height: number; speed: number; phase: number }) {
  const bird = useRef<THREE.Group>(null);
  const leftWing = useRef<THREE.Mesh>(null);
  const rightWing = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const group = bird.current;
    if (!group) return;
    const angle = clock.elapsedTime * speed + phase;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * 0.65;
    group.position.set(x, height + Math.sin(angle * 2) * 0.7, z);
    group.rotation.y = angle + Math.PI / 2;
    const flap = Math.sin(clock.elapsedTime * 8 + phase) * 0.58;
    if (leftWing.current) leftWing.current.rotation.z = 0.25 + flap;
    if (rightWing.current) rightWing.current.rotation.z = -0.25 - flap;
  });

  return (
    <group ref={bird} scale={0.42}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.22, 0.75, 6]} />
        <meshStandardMaterial color="#f5f0df" flatShading />
      </mesh>
      <mesh ref={leftWing} position={[-0.42, 0, 0]} rotation={[0, 0, 0.25]} castShadow>
        <boxGeometry args={[0.85, 0.06, 0.3]} />
        <meshStandardMaterial color="#e7e2d3" flatShading />
      </mesh>
      <mesh ref={rightWing} position={[0.42, 0, 0]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[0.85, 0.06, 0.3]} />
        <meshStandardMaterial color="#e7e2d3" flatShading />
      </mesh>
    </group>
  );
}

function Airplane() {
  const plane = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!plane.current) return;
    const progress = (clock.elapsedTime % 36) / 36;
    plane.current.position.set(-72 + progress * 144, 14 + Math.sin(progress * Math.PI) * 1.8, -25 + progress * 18);
    plane.current.rotation.z = Math.sin(progress * Math.PI * 2) * 0.04;
  });

  return (
    <group ref={plane} scale={0.72} rotation={[0, -0.12, 0]}>
      <mesh rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.34, 0.45, 4.2, 10]} />
        <meshStandardMaterial color="#f2f3ef" flatShading />
      </mesh>
      <mesh position={[2.28, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.34, 0.9, 10]} />
        <meshStandardMaterial color="#e45145" flatShading />
      </mesh>
      <mesh position={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[1.15, 0.12, 4.2]} />
        <meshStandardMaterial color="#2f72bd" flatShading />
      </mesh>
      <mesh position={[-1.65, 0.62, 0]} rotation={[0, 0, -0.35]} castShadow>
        <boxGeometry args={[0.85, 0.1, 1.55]} />
        <meshStandardMaterial color="#e45145" flatShading />
      </mesh>
    </group>
  );
}

function CampusBus({ color = "#d92f32", phase = 0 }: { color?: string; phase?: number }) {
  const bus = useRef<RapierRigidBody>(null);
  const wheelGroups = useRef<Array<THREE.Group | null>>([]);
  const surfaceRotation = useMemo(() => new THREE.Quaternion(), []);
  const route = useMemo(
    () => new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-19, 0, -17),
        new THREE.Vector3(-14, 0, -22),
        new THREE.Vector3(13, 0, -22),
        new THREE.Vector3(18, 0, -17),
        new THREE.Vector3(18, 0, 4),
        new THREE.Vector3(13, 0, 9),
        new THREE.Vector3(-14, 0, 9),
        new THREE.Vector3(-19, 0, 4),
      ],
      true,
      "centripetal",
      0.35,
    ),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!bus.current) return;
    const progress = (clock.elapsedTime * 0.031 + phase) % 1;
    const routePoint = route.getPointAt(progress);
    const tangent = route.getTangentAt(progress);
    const x = routePoint.x;
    const z = routePoint.z;
    bus.current.setNextKinematicTranslation({ x, y: worldSurfaceY(x, z) + 0.09, z });
    setVehicleSurfaceRotation(surfaceRotation, x, z, tangent.x, tangent.z);
    bus.current.setNextKinematicRotation(surfaceRotation);
    wheelGroups.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x -= delta * 8;
    });
  });

  return (
    <RigidBody ref={bus} type="kinematicPosition" colliders={false} position={[-19, 0, -17]}>
      <CuboidCollider args={[0.78, 1.05, 1.72]} position={[0, 1.12, 0]} />
      <group scale={0.82}>
      <mesh position={[0, 1.35, 0]} castShadow>
        <boxGeometry args={[1.8, 2.35, 4.2]} />
        <meshStandardMaterial color={color} flatShading roughness={0.72} />
      </mesh>
      <mesh position={[0, 2.18, 0]} castShadow>
        <boxGeometry args={[1.86, 0.18, 4.28]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[-0.92, 0.92].map((x) => (
        <group key={`bus-side-${x}`}>
          {[-1.25, -0.42, 0.42, 1.25].map((z) => (
            <mesh key={z} position={[x, 1.72, z]} castShadow>
              <boxGeometry args={[0.05, 0.68, 0.66]} />
              <meshStandardMaterial color="#263e49" roughness={0.32} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 1.62, 2.13]} castShadow>
        <boxGeometry args={[1.5, 0.82, 0.06]} />
        <meshStandardMaterial color="#243b46" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.92, 2.18]} castShadow>
        <boxGeometry args={[1.55, 0.24, 0.08]} />
        <meshStandardMaterial color="#f0bf35" />
      </mesh>
      {[[-0.96, -1.35], [0.96, -1.35], [-0.96, 1.35], [0.96, 1.35]].map(([x, z], index) => (
        <group
          key={`${x}-${z}`}
          ref={(wheel) => { wheelGroups.current[index] = wheel; }}
          position={[x, 0.4, z]}
        >
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.39, 0.39, 0.24, 14]} />
            <meshStandardMaterial color="#20272b" roughness={0.92} />
          </mesh>
          <mesh position={[x < 0 ? -0.13 : 0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.16, 0.16, 0.03, 12]} />
            <meshStandardMaterial color="#9da5a5" metalness={0.35} roughness={0.55} />
          </mesh>
        </group>
      ))}
      </group>
    </RigidBody>
  );
}

export function CampusBusStop() {
  const signTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 192;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#f5c83d";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#173456";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "900 92px Arial, sans-serif";
      context.fillText("HALTE UMS", canvas.width / 2, canvas.height / 2);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  const x = 0;
  const z = 14.5;

  return (
    <group position={[x, worldSurfaceY(x, z), z]} rotation={worldSurfaceTilt(x, z)}>
      <mesh position={[0, 2.35, 0]} castShadow>
        <boxGeometry args={[3.5, 0.22, 1.55]} />
        <meshStandardMaterial color="#d73539" flatShading />
      </mesh>
      {[-1.48, 1.48].map((postX) => (
        <mesh key={postX} position={[postX, 1.18, -0.5]} castShadow>
          <boxGeometry args={[0.12, 2.35, 0.12]} />
          <meshStandardMaterial color="#32464e" />
        </mesh>
      ))}
      <mesh position={[0, 0.72, -0.28]} castShadow>
        <boxGeometry args={[2.35, 0.18, 0.58]} />
        <meshStandardMaterial color="#d5a245" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.7, -0.58]} castShadow>
        <planeGeometry args={[2.45, 0.78]} />
        <meshBasicMaterial map={signTexture} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Cloud({ base, speed, scale = 1 }: { base: [number, number, number]; speed: number; scale?: number }) {
  const cloud = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!cloud.current) return;
    cloud.current.position.x = ((base[0] + clock.elapsedTime * speed + 58) % 116) - 58;
  });
  return (
    <group ref={cloud} position={base} scale={scale}>
      {[[-1.2, 0, 0], [-0.35, 0.35, 0], [0.55, 0.15, 0], [1.25, -0.05, 0]].map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} scale={[1.25, 0.72, 0.8]}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshStandardMaterial color="#f6fbfd" transparent opacity={0.82} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function GojekMotor() {
  const motor = useRef<THREE.Group>(null);
  const surfaceRotation = useMemo(() => new THREE.Quaternion(), []);

  useFrame(({ clock }) => {
    if (!motor.current) return;
    const progress = (clock.elapsedTime * 0.055) % 1;
    const x = -45 + progress * 90;
    const z = 11.25;
    motor.current.position.set(x, worldSurfaceY(x, z) + 0.145, z);
    setVehicleSurfaceRotation(surfaceRotation, x, z, 1, 0);
    motor.current.quaternion.copy(surfaceRotation);
  });

  return (
    <group ref={motor} scale={0.82}>
      {[-0.72, 0.72].map((z) => (
        <mesh key={z} position={[-0.22, 0.38, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.31, 0.31, 0.17, 12]} />
          <meshStandardMaterial color="#253137" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[-0.22, 0.65, 0]} castShadow>
        <boxGeometry args={[0.22, 0.2, 1.25]} />
        <meshStandardMaterial color="#26363b" />
      </mesh>
      <mesh position={[-0.22, 0.88, 0.32]} rotation={[0.18, 0, 0]} castShadow>
        <boxGeometry args={[0.48, 0.55, 0.62]} />
        <meshStandardMaterial color="#18a86b" flatShading />
      </mesh>
      <mesh position={[-0.22, 1.04, -0.22]} castShadow>
        <boxGeometry args={[0.46, 0.13, 0.62]} />
        <meshStandardMaterial color="#30383b" />
      </mesh>

      <mesh position={[-0.22, 1.48, -0.15]} castShadow>
        <boxGeometry args={[0.5, 0.72, 0.38]} />
        <meshStandardMaterial color="#159c66" flatShading />
      </mesh>
      <mesh position={[-0.22, 1.96, -0.12]} castShadow>
        <sphereGeometry args={[0.27, 10, 7]} />
        <meshStandardMaterial color="#c78d68" flatShading />
      </mesh>
      <mesh position={[-0.22, 2.09, -0.12]} scale={[1.12, 0.62, 1.05]} castShadow>
        <sphereGeometry args={[0.3, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#17a66c" flatShading />
      </mesh>

      {[-0.48, 0.04].map((x) => (
        <mesh key={`gojek-arm-${x}`} position={[x, 1.42, 0.35]} rotation={[0.7, 0, x < 0 ? -0.15 : 0.15]} castShadow>
          <boxGeometry args={[0.14, 0.68, 0.14]} />
          <meshStandardMaterial color="#c78d68" flatShading />
        </mesh>
      ))}
      <mesh position={[-0.22, 1.18, 0.76]} castShadow>
        <boxGeometry args={[0.78, 0.08, 0.08]} />
        <meshStandardMaterial color="#34484d" />
      </mesh>
      <mesh position={[-0.22, 0.97, 0.78]} castShadow>
        <sphereGeometry args={[0.13, 8, 6]} />
        <meshStandardMaterial color="#f5d25b" emissive="#d79d28" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0.55, 0.42, 0.12]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.13, 12]} />
        <meshStandardMaterial color="#253137" roughness={0.9} />
      </mesh>
      <mesh position={[0.52, 0.82, 0.02]} castShadow>
        <boxGeometry args={[0.78, 0.72, 1.05]} />
        <meshStandardMaterial color="#d4a73e" flatShading />
      </mesh>
      <mesh position={[0.52, 1.2, 0.02]} castShadow>
        <boxGeometry args={[0.84, 0.1, 1.1]} />
        <meshStandardMaterial color="#f0c453" flatShading />
      </mesh>
      <mesh position={[0.52, 0.98, 0.57]} castShadow>
        <boxGeometry args={[0.5, 0.2, 0.04]} />
        <meshStandardMaterial color="#138e5a" />
      </mesh>
    </group>
  );
}

function WalkingNpc({ start, end, speed, phase, shirt }: { start: [number, number]; end: [number, number]; speed: number; phase: number; shirt: string }) {
  const npc = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!npc.current) return;
    const cycle = (clock.elapsedTime * speed + phase) % 2;
    const forward = cycle <= 1;
    const progress = forward ? cycle : 2 - cycle;
    const x = THREE.MathUtils.lerp(start[0], end[0], progress);
    const z = THREE.MathUtils.lerp(start[1], end[1], progress);
    npc.current.position.set(x, worldSurfaceY(x, z), z);
    const dx = (end[0] - start[0]) * (forward ? 1 : -1);
    const dz = (end[1] - start[1]) * (forward ? 1 : -1);
    const tilt = worldSurfaceTilt(x, z);
    npc.current.rotation.set(tilt[0], Math.atan2(dx, dz), tilt[2]);
    const swing = Math.sin(clock.elapsedTime * 8 + phase * 3) * 0.55;
    if (leftArm.current) leftArm.current.rotation.x = swing;
    if (rightArm.current) rightArm.current.rotation.x = -swing;
    if (leftLeg.current) leftLeg.current.rotation.x = -swing;
    if (rightLeg.current) rightLeg.current.rotation.x = swing;
  });

  const limbMaterial = <meshStandardMaterial color="#d9d4c8" flatShading />;
  return (
    <group ref={npc} scale={0.72}>
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.28, 10, 7]} />
        <meshStandardMaterial color="#bd835e" flatShading />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.72, 0.92, 0.42]} />
        <meshStandardMaterial color={shirt} flatShading />
      </mesh>
      <group ref={leftArm} position={[-0.48, 1.34, 0]}><mesh position={[0, -0.38, 0]} castShadow><boxGeometry args={[0.2, 0.76, 0.2]} />{limbMaterial}</mesh></group>
      <group ref={rightArm} position={[0.48, 1.34, 0]}><mesh position={[0, -0.38, 0]} castShadow><boxGeometry args={[0.2, 0.76, 0.2]} />{limbMaterial}</mesh></group>
      <group ref={leftLeg} position={[-0.2, 0.64, 0]}><mesh position={[0, -0.38, 0]} castShadow><boxGeometry args={[0.25, 0.76, 0.28]} /><meshStandardMaterial color="#344e68" /></mesh></group>
      <group ref={rightLeg} position={[0.2, 0.64, 0]}><mesh position={[0, -0.38, 0]} castShadow><boxGeometry args={[0.25, 0.76, 0.28]} /><meshStandardMaterial color="#344e68" /></mesh></group>
    </group>
  );
}

function SimpleStudent({ shirt, seated = false }: { shirt: string; seated?: boolean }) {
  return (
    <group scale={0.68}>
      <mesh position={[0, seated ? 1.35 : 1.72, 0]} castShadow><sphereGeometry args={[0.28, 10, 7]} /><meshStandardMaterial color="#bd835e" flatShading /></mesh>
      <mesh position={[0, seated ? 0.78 : 1.05, 0]} castShadow><boxGeometry args={[0.7, 0.84, 0.4]} /><meshStandardMaterial color={shirt} flatShading /></mesh>
      {[-0.42, 0.42].map((x) => <mesh key={`arm-${x}`} position={[x, seated ? 0.72 : 1.02, 0.15]} rotation={[seated ? -0.75 : 0, 0, x < 0 ? -0.12 : 0.12]} castShadow><boxGeometry args={[0.18, 0.7, 0.18]} /><meshStandardMaterial color="#d9d4c8" flatShading /></mesh>)}
      {[-0.2, 0.2].map((x) => <mesh key={`leg-${x}`} position={[x, seated ? 0.34 : 0.3, seated ? 0.34 : 0]} rotation={[seated ? -Math.PI / 2 : 0, 0, 0]} castShadow><boxGeometry args={[0.23, 0.72, 0.25]} /><meshStandardMaterial color="#344e68" flatShading /></mesh>)}
    </group>
  );
}

function GardenStudents() {
  const x = -8;
  const z = 23;
  return (
    <group position={[x, worldSurfaceY(x, z), z]} rotation={worldSurfaceTilt(x, z)}>
      <mesh position={[0, 0.36, 0]} castShadow><boxGeometry args={[3.2, 0.24, 0.62]} /><meshStandardMaterial color="#9a6847" roughness={0.9} /></mesh>
      {[-1.35, 1.35].map((postX) => <mesh key={postX} position={[postX, 0.18, 0]} castShadow><boxGeometry args={[0.16, 0.36, 0.52]} /><meshStandardMaterial color="#72503b" /></mesh>)}
      <group position={[-0.7, 0.5, -0.05]} rotation={[0, 0.2, 0]}><SimpleStudent seated shirt="#397eb6" /></group>
      <group position={[0.7, 0.5, -0.05]} rotation={[0, -0.2, 0]}><SimpleStudent seated shirt="#d45f59" /></group>
    </group>
  );
}

function StudentBoat() {
  const boat = useRef<THREE.Group>(null);
  const paddles = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!boat.current) return;
    const cycle = (Math.sin(clock.elapsedTime * 0.22) + 1) / 2;
    const x = THREE.MathUtils.lerp(-13, 13, cycle);
    const z = 33 + Math.sin(x * 0.085) * 1.55;
    boat.current.position.set(x, worldSurfaceY(x, z) + 0.24 + Math.sin(clock.elapsedTime * 1.7) * 0.035, z);
    boat.current.rotation.y = Math.cos(clock.elapsedTime * 0.22) >= 0 ? Math.PI / 2 : -Math.PI / 2;
    if (paddles.current) paddles.current.rotation.z = Math.sin(clock.elapsedTime * 2.3) * 0.48;
  });
  return (
    <group ref={boat} scale={0.72}>
      <mesh castShadow scale={[1, 0.55, 1]}><cylinderGeometry args={[0.78, 0.46, 3.7, 4]} /><meshStandardMaterial color="#c8733d" flatShading /></mesh>
      <mesh position={[0, 0.33, 0]} castShadow><boxGeometry args={[1.08, 0.18, 2.35]} /><meshStandardMaterial color="#704535" /></mesh>
      <group position={[0, 0.34, -0.35]}><SimpleStudent seated shirt="#2d8b74" /></group>
      <group ref={paddles} position={[0, 0.85, 0.05]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.035, 0.035, 3.2, 7]} /><meshStandardMaterial color="#dfc38a" /></mesh>
        {[-1.62, 1.62].map((x) => <mesh key={x} position={[x, 0, 0]} castShadow><boxGeometry args={[0.5, 0.12, 0.28]} /><meshStandardMaterial color="#d7a24c" /></mesh>)}
      </group>
    </group>
  );
}

function SoccerPlayers() {
  const ball = useRef<THREE.Mesh>(null);
  const runnerA = useRef<THREE.Group>(null);
  const runnerB = useRef<THREE.Group>(null);
  const x = 3.8;
  const z = -12;
  useFrame(({ clock }) => {
    const sway = Math.sin(clock.elapsedTime * 1.35);
    if (ball.current) ball.current.position.set(sway * 1.7, 0.3 + Math.abs(Math.sin(clock.elapsedTime * 2.7)) * 0.16, 0.8);
    if (runnerA.current) runnerA.current.position.x = sway * 0.8 - 1.25;
    if (runnerB.current) runnerB.current.position.x = sway * 0.8 + 1.25;
  });
  return (
    <group position={[x, worldSurfaceY(x, z) + 0.13, z]} rotation={worldSurfaceTilt(x, z)}>
      <group ref={runnerA} position={[-1.25, 0, 0]} rotation={[0, 0.3, 0]}><SimpleStudent shirt="#f0c63e" /></group>
      <group ref={runnerB} position={[1.25, 0, 1.45]} rotation={[0, -2.7, 0]}><SimpleStudent shirt="#316fba" /></group>
      <mesh ref={ball} position={[0, 0.3, 0.8]} castShadow><sphereGeometry args={[0.22, 10, 7]} /><meshStandardMaterial color="#f7f4e7" flatShading /></mesh>
    </group>
  );
}

function CampusCar() {
  const car = useRef<RapierRigidBody>(null);
  const surfaceRotation = useMemo(() => new THREE.Quaternion(), []);
  useFrame(({ clock }) => {
    if (!car.current) return;
    const progress = (clock.elapsedTime * 0.035 + 0.38) % 1;
    const x = 43 - progress * 86;
    const z = 8.4;
    car.current.setNextKinematicTranslation({ x, y: worldSurfaceY(x, z) + 0.145, z });
    setVehicleSurfaceRotation(surfaceRotation, x, z, -1, 0);
    car.current.setNextKinematicRotation(surfaceRotation);
  });
  return (
    <RigidBody ref={car} type="kinematicPosition" colliders={false} position={[0, 0, 8.4]}>
      <CuboidCollider args={[0.68, 0.58, 1.2]} position={[0, 0.78, 0]} />
      <group scale={0.72}>
      <mesh position={[0, 0.72, 0]} castShadow><boxGeometry args={[1.75, 0.65, 3.25]} /><meshStandardMaterial color="#efefe8" flatShading /></mesh>
      <mesh position={[0, 1.2, -0.22]} castShadow><boxGeometry args={[1.5, 0.72, 1.65]} /><meshStandardMaterial color="#4c82a2" flatShading /></mesh>
      {[[-0.92, -1.05], [0.92, -1.05], [-0.92, 1.05], [0.92, 1.05]].map(([wheelX, wheelZ]) => <mesh key={`${wheelX}-${wheelZ}`} position={[wheelX, 0.42, wheelZ]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.34, 0.34, 0.2, 12]} /><meshStandardMaterial color="#222a2e" /></mesh>)}
      </group>
    </RigidBody>
  );
}

function BecakWheel({ position, radius = 0.72 }: { position: [number, number, number]; radius?: number }) {
  return (
    <group position={position}>
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow><torusGeometry args={[radius, 0.075, 8, 24]} /><meshStandardMaterial color="#16877d" roughness={0.72} /></mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[0.13, 12]} /><meshStandardMaterial color="#54656a" side={THREE.DoubleSide} /></mesh>
      {Array.from({ length: 10 }, (_, index) => (
        <mesh key={index} rotation={[index * Math.PI / 10, 0, 0]}>
          <boxGeometry args={[0.025, radius * 1.72, 0.025]} />
          <meshStandardMaterial color="#d8dedb" metalness={0.25} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function Becak() {
  const becak = useRef<RapierRigidBody>(null);
  const surfaceRotation = useMemo(() => new THREE.Quaternion(), []);
  useFrame(({ clock }) => {
    if (!becak.current) return;
    const progress = (clock.elapsedTime * 0.027 + 0.7) % 1;
    const x = -42 + progress * 84;
    const z = 11.7;
    becak.current.setNextKinematicTranslation({ x, y: worldSurfaceY(x, z) + 0.09, z });
    setVehicleSurfaceRotation(surfaceRotation, x, z, 1, 0);
    becak.current.setNextKinematicRotation(surfaceRotation);
  });
  return (
    <RigidBody ref={becak} type="kinematicPosition" colliders={false} position={[0, 0, 11.7]}>
      <CuboidCollider args={[0.8, 1.05, 1.25]} position={[0, 1.12, -0.08]} />
      <group scale={0.82}>
      <BecakWheel position={[-0.93, 0.72, 0.65]} />
      <BecakWheel position={[0.93, 0.72, 0.65]} />
      <BecakWheel position={[0, 0.62, -1.45]} radius={0.6} />

      <mesh position={[0, 0.7, 0.55]} castShadow><boxGeometry args={[1.62, 0.88, 1.2]} /><meshStandardMaterial color="#d8d4cc" flatShading /></mesh>
      <mesh position={[0, 0.92, 1.12]} castShadow><boxGeometry args={[1.5, 0.78, 0.12]} /><meshStandardMaterial color="#bfc5c1" flatShading /></mesh>
      <mesh position={[0, 0.54, 0.34]} castShadow><boxGeometry args={[1.28, 0.16, 0.72]} /><meshStandardMaterial color="#f0ede4" /></mesh>
      {[-0.78, 0.78].map((postX) => (
        <group key={postX}>
          <mesh position={[postX, 1.62, 0.02]} castShadow><cylinderGeometry args={[0.04, 0.04, 2.1, 6]} /><meshStandardMaterial color="#237e88" /></mesh>
          <mesh position={[postX, 1.62, 1.02]} castShadow><cylinderGeometry args={[0.04, 0.04, 2.1, 6]} /><meshStandardMaterial color="#237e88" /></mesh>
        </group>
      ))}
      <mesh position={[0, 2.66, 0.48]} rotation={[0.05, 0, 0]} castShadow><boxGeometry args={[1.96, 0.12, 1.75]} /><meshStandardMaterial color="#53aeb0" flatShading /></mesh>

      <mesh position={[0, 0.86, -0.42]} rotation={[0.62, 0, 0]} castShadow><boxGeometry args={[0.09, 0.09, 2.55]} /><meshStandardMaterial color="#246a78" /></mesh>
      <mesh position={[0, 0.78, -0.73]} rotation={[-0.62, 0, 0]} castShadow><boxGeometry args={[0.09, 0.09, 1.72]} /><meshStandardMaterial color="#246a78" /></mesh>
      <mesh position={[0, 1.06, -0.72]} castShadow><boxGeometry args={[1.05, 0.08, 0.08]} /><meshStandardMaterial color="#246a78" /></mesh>
      <mesh position={[0, 1.18, -1.17]} rotation={[0.25, 0, 0]} castShadow><boxGeometry args={[0.54, 0.12, 0.3]} /><meshStandardMaterial color="#4a352d" /></mesh>
      <mesh position={[0, 0.62, -0.92]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.18, 0.035, 7, 16]} /><meshStandardMaterial color="#d5b148" /></mesh>
      {[-0.32, 0.32].map((pedalX) => <mesh key={pedalX} position={[pedalX, 0.62, -0.92]} castShadow><boxGeometry args={[0.36, 0.06, 0.12]} /><meshStandardMaterial color="#5a6264" /></mesh>)}
      <group position={[0, 0.54, -0.96]} rotation={[0, 0, 0]}><SimpleStudent seated shirt="#236b98" /></group>
      </group>
    </RigidBody>
  );
}

export function CampusLife() {
  return (
    <group>
      <Bird radius={20} height={9} speed={0.11} phase={0} />
      <Bird radius={21.5} height={9.8} speed={0.105} phase={0.38} />
      <Bird radius={19} height={8.5} speed={0.115} phase={0.76} />
      <Bird radius={22} height={10.4} speed={0.1} phase={1.12} />
      <Airplane />
      <Cloud base={[-34, 12, -32]} speed={0.38} scale={1.25} />
      <Cloud base={[4, 10.5, -38]} speed={0.28} scale={0.9} />
      <Cloud base={[34, 13, -18]} speed={0.34} scale={1.1} />
      <Cloud base={[-18, 11.5, 22]} speed={0.24} scale={0.78} />
      <CampusBus />
      <CampusBus color="#2e70bd" phase={0.5} />
      <GojekMotor />
      <CampusCar />
      <Becak />
      <GardenStudents />
      <StudentBoat />
      <SoccerPlayers />
      <WalkingNpc start={[-39, 6]} end={[-25, 6]} speed={0.055} phase={0.2} shirt="#d66559" />
      <WalkingNpc start={[-14, 14.5]} end={[3, 14.5]} speed={0.045} phase={0.9} shirt="#695fa9" />
      <WalkingNpc start={[23, -16]} end={[23, 2]} speed={0.05} phase={1.4} shirt="#e1aa3d" />
      <WalkingNpc start={[31, 14.5]} end={[42, 14.5]} speed={0.06} phase={0.55} shirt="#367fb8" />
    </group>
  );
}
