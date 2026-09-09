import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { CuboidCollider, CylinderCollider, Physics, RigidBody } from "@react-three/rapier";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { locations } from "../data/locations";
import { useExperience } from "../store/useExperience";
import { WORLD_CENTER_Y, WORLD_RADIUS, WORLD_VERTICAL_RADIUS, worldSurfaceTilt, worldSurfaceY } from "../worldGeometry";
import { CAMPUS_ROADS, createCurvedRoadGeometry, createCurvedRoadMarkings } from "./curvedRoad";
import { CampusBuilding, CampusOneGate, CampusSportsCourts, CampusStreetStalls, CampusTrees, STREET_STALLS } from "./CampusBuildings";
import { CampusBusStop, CampusLife } from "./CampusLife";
import { CampusRiver } from "./CampusRiver";
import { Player } from "./Player";
import { SceneReady } from "./SceneReady";

function CampusRoads() {
  const roadData = useMemo(() => {
    return CAMPUS_ROADS.map((road) => ({
      roadGeometry: createCurvedRoadGeometry(road.startX, road.startZ, road.endX, road.endZ, road.width),
      markingGeometry: createCurvedRoadMarkings(road.startX, road.startZ, road.endX, road.endZ),
    }));
  }, []);

  return (
    <group>
      {roadData.map(({ roadGeometry, markingGeometry }, index) => (
        <group key={`campus-road-${index}`}>
          <mesh geometry={roadGeometry} receiveShadow castShadow>
            <meshStandardMaterial color="#657079" roughness={0.92} flatShading side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={markingGeometry}>
            <meshBasicMaterial color="#f3d263" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GradientSky() {
  const uniforms = useMemo(() => ({
    horizonColor: { value: new THREE.Color("#c7ebf4") },
    middleColor: { value: new THREE.Color("#86cbed") },
    zenithColor: { value: new THREE.Color("#3b9dde") },
  }), []);

  return (
    <mesh scale={175} renderOrder={-1000}>
      <sphereGeometry args={[1, 48, 24]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vDirection;
          void main() {
            vDirection = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 horizonColor;
          uniform vec3 middleColor;
          uniform vec3 zenithColor;
          varying vec3 vDirection;
          void main() {
            float height = clamp(vDirection.y * 0.5 + 0.5, 0.0, 1.0);
            vec3 lowerSky = mix(horizonColor, middleColor, smoothstep(0.38, 0.68, height));
            vec3 sky = mix(lowerSky, zenithColor, smoothstep(0.62, 1.0, height));
            gl_FragColor = vec4(sky, 1.0);
          }
        `}
      />
    </mesh>
  );
}

const riverCenterZ = (x: number) => 33 + Math.sin(x * 0.085) * 1.55;

function RiverBankColliders() {
  const segments = useMemo(() => {
    const ranges: Array<[number, number]> = [[-40, -22.5], [-15.5, 15.5], [22.5, 40]];
    return ranges.flatMap(([start, end]) => {
      const length = end - start;
      const count = Math.ceil(length / 4);
      return Array.from({ length: count }, (_, index) => {
        const x0 = start + (length * index) / count;
        const x1 = start + (length * (index + 1)) / count;
        const x = (x0 + x1) / 2;
        return { x, halfLength: (x1 - x0) / 2 + 0.08, z: riverCenterZ(x) };
      });
    });
  }, []);

  return (
    <>
      {segments.flatMap(({ x, halfLength, z }, index) => [-1, 1].map((side) => {
        const bankZ = z + side * 1.88;
        return (
          <CuboidCollider
            key={`river-bank-${index}-${side}`}
            args={[halfLength, 0.82, 0.16]}
            position={[x, worldSurfaceY(x, bankZ) + 0.82, bankZ]}
          />
        );
      }))}
      {[-40, 40].map((x) => (
        <CuboidCollider
          key={`river-end-${x}`}
          args={[0.16, 0.82, 1.9]}
          position={[x, worldSurfaceY(x, riverCenterZ(x)) + 0.82, riverCenterZ(x)]}
        />
      ))}
    </>
  );
}

function LocationMarker({
  id,
  position,
  accent,
  label,
  offsetZ = 4.2,
}: {
  id: string;
  position: [number, number, number];
  accent: string;
  label: string;
  offsetZ?: number;
}) {
  const marker = useRef<THREE.Group>(null);
  const visited = useExperience((state) => state.visitedLocationIds.includes(id));
  const markerZ = position[2] + offsetZ;
  const markerBase: [number, number, number] = [position[0], worldSurfaceY(position[0], markerZ), markerZ];

  useFrame(({ clock }) => {
    if (marker.current) marker.current.position.y = 1.9 + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.18;
  });

  return (
    <group position={markerBase}>
      <group ref={marker} position={[0, 1.9, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.58, 0.13, 8, 20]} />
          <meshStandardMaterial color={visited ? "#4e9b72" : accent} emissive={visited ? "#214b36" : accent} emissiveIntensity={0.18} />
        </mesh>
        <mesh position={[0, -0.72, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.23, 0.52, 8]} />
          <meshStandardMaterial color={visited ? "#4e9b72" : accent} />
        </mesh>
        <Html center distanceFactor={13} position={[0, 0.85, 0]} style={{ pointerEvents: "none" }}>
          <div className={`world-label ${visited ? "is-visited" : ""}`}>
            <span>{visited ? "✓" : id.replace("L", "")}</span>
            {label}
          </div>
        </Html>
      </group>
    </group>
  );
}

function CampusAreaLabel({ position, title }: { position: [number, number, number]; title: string }) {
  const curvedPosition: [number, number, number] = [position[0], worldSurfaceY(position[0], position[2]) + position[1], position[2]];
  return (
    <Html center position={curvedPosition} distanceFactor={18} style={{ pointerEvents: "none" }}>
      <div className="campus-area-label">{title}</div>
    </Html>
  );
}

function World() {
  return (
    <>
      <color attach="background" args={["#b9def0"]} />
      <GradientSky />
      <fog attach="fog" args={["#b9def0", 94, 170]} />
      <ambientLight intensity={1.65} />
      <directionalLight
        position={[-18, 28, 16]}
        intensity={2.5}
        color="#fff1c7"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-56}
        shadow-camera-right={56}
        shadow-camera-top={56}
        shadow-camera-bottom={-56}
      />
      <hemisphereLight args={["#cfeeff", "#6c8e62", 1.1]} />

      <RigidBody type="fixed" colliders={false}>
        <mesh position={[0, WORLD_CENTER_Y, 0]} scale={[1, WORLD_VERTICAL_RADIUS / WORLD_RADIUS, 1]} receiveShadow castShadow>
          <sphereGeometry args={[WORLD_RADIUS, 64, 32]} />
          <meshStandardMaterial color="#aac982" roughness={1} flatShading />
        </mesh>

        <CampusRoads />
        <CampusRiver />
        <RiverBankColliders />

        <CuboidCollider args={[1.18, 1.55, 1.3]} position={[-23.45, worldSurfaceY(-23.45, 26.85) + 1.55, 26.85]} />
        <CuboidCollider args={[1.18, 1.55, 1.3]} position={[-14.55, worldSurfaceY(-14.55, 26.85) + 1.55, 26.85]} />
        <CuboidCollider args={[1.75, 1.2, 0.78]} position={[0, worldSurfaceY(0, 14.5) + 1.2, 14.5]} rotation={worldSurfaceTilt(0, 14.5)} />

        <CuboidCollider
          args={[3.8, 0.9, 0.35]}
          position={[-10.28, worldSurfaceY(-10.28, -14.51) + 0.9, -14.51]}
          rotation={[0, -0.08, 0]}
        />

        {[-5.8, -1.8].map((x) => (
          <CuboidCollider
            key={`coworking-table-${x}`}
            args={[1.35, 0.5, 0.52]}
            position={[x, worldSurfaceY(x, -10.25) + 0.5, -10.25]}
            rotation={[0, -0.08, 0]}
          />
        ))}

        <CylinderCollider
          args={[0.9, 6.85]}
          position={[28, worldSurfaceY(28, 20) + 0.72, 20]}
          rotation={worldSurfaceTilt(28, 20)}
        />

        {STREET_STALLS.map((stall) => {
          const [x, , z] = stall.position;
          return (
            <CuboidCollider
              key={`stall-collider-${stall.kind}`}
              args={[1.08, 1.3, 0.69]}
              position={[x, worldSurfaceY(x, z) + 1.3, z]}
              rotation={[0, stall.rotation, 0]}
            />
          );
        })}

        {locations.filter((location) => location.kind !== "lakeside").map((location) => {
          const wide = location.kind === "edutorium" || location.kind === "siti-walidah";
          const isSitiWalidah = location.kind === "siti-walidah";
          const isEdutorium = location.kind === "edutorium";
          const isHospital = location.kind === "hospital";
          const isPtiOffice = location.kind === "pti-office";
          const isMedicalCenter = location.kind === "medical-center";
          const isStudentCenter = location.kind === "student-center";
          return (
            <CuboidCollider
              key={`collider-${location.id}`}
              args={[isSitiWalidah ? 6 : isEdutorium ? 6.6 : isHospital ? 4.8 : isStudentCenter ? 4.3 : isPtiOffice || isMedicalCenter ? 2.6 : wide ? 4.7 : 3.5, isSitiWalidah ? 3.7 : isEdutorium ? 3.1 : isHospital ? 3.6 : isStudentCenter ? 3.35 : isPtiOffice || isMedicalCenter ? 1.65 : 2.6, isSitiWalidah ? 5.9 : isEdutorium ? 5.1 : isHospital ? 3 : isStudentCenter ? 2.5 : isPtiOffice || isMedicalCenter ? 1.9 : wide ? 3.25 : 2.3]}
              position={[
                location.position[0],
                worldSurfaceY(location.position[0], location.position[2]) + (isSitiWalidah ? 3.7 : isEdutorium ? 3.1 : isHospital ? 3.6 : isStudentCenter ? 3.35 : isPtiOffice || isMedicalCenter ? 1.65 : 2.2),
                location.position[2],
              ]}
              rotation={[0, location.rotation ?? 0, 0]}
            />
          );
        })}
      </RigidBody>

      {locations.map((location) => (
        <CampusBuilding key={location.id} location={location} />
      ))}
      <CampusOneGate />
      <CampusStreetStalls />
      <CampusSportsCourts />
      <CampusTrees />
      <CampusBusStop />
      <CampusLife />
      <CampusAreaLabel position={[-37, 0.3, 28]} title="Kampus 1" />
      <CampusAreaLabel position={[20, 0.3, 32]} title="Kampus 2" />
      <CampusAreaLabel position={[24, 0.3, -37]} title="Edutorium" />
      {locations.map((location) => (
        <LocationMarker
          key={`marker-${location.id}`}
          id={location.id}
          position={location.position}
          accent={location.accent}
          label={location.mapLabel}
          offsetZ={location.kind === "edutorium" ? 7.8 : location.kind === "lakeside" ? 8 : location.kind === "siti-walidah" ? 9.4 : location.kind === "hospital" ? 4.7 : location.kind === "pti-office" || location.kind === "medical-center" ? 3 : 4.2}
        />
      ))}
      <Player />
    </>
  );
}

function SceneLoader() {
  return (
    <Html center>
      <div className="scene-loader-card" role="status" aria-label="Memuat aset">
        <div className="scene-loader-spinner" />
        <span>Menyiapkan kampus 3D...</span>
      </div>
    </Html>
  );
}

export function CampusScene() {
  const quality = useExperience((state) => state.quality);

  return (
    <Canvas
      shadows={quality === "detail"}
      dpr={quality === "detail" ? [1, 1.5] : 1}
      camera={{ position: [-14, 7, 59], fov: 44, near: 0.1, far: 190 }}
      gl={{ antialias: quality === "detail", powerPreference: "high-performance" }}
    >
      <Suspense fallback={<SceneLoader />}>
        <Physics gravity={[0, -28, 0]} timeStep="vary">
          <World />
          <SceneReady />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
