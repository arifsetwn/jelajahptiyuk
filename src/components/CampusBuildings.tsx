import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { CampusLocation } from "../types";
import { worldSurfaceTilt, worldSurfaceY } from "../worldGeometry";

const wall = "#f1ead9";
const dark = "#173456";
const blue = "#315fbe";
const yellow = "#e5b83f";
const green = "#3f8065";
const red = "#bd5b4b";

function Box({
  position,
  scale,
  color,
  radius = 0.12,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  radius?: number;
}) {
  return (
    <RoundedBox position={position} args={scale} radius={radius} smoothness={2} castShadow receiveShadow>
      <meshStandardMaterial color={color} flatShading roughness={0.85} />
    </RoundedBox>
  );
}

function WindowBand({
  y,
  width,
  depth = 0.08,
  z,
  color = "#9bc8d5",
}: {
  y: number;
  width: number;
  depth?: number;
  z: number;
  color?: string;
}) {
  return (
    <mesh position={[0, y, z]} castShadow>
      <boxGeometry args={[width, 0.38, depth]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
  );
}

function Sign({ width = 2.7, color = blue }: { width?: number; color?: string }) {
  return (
    <mesh position={[0, 1.25, 2.06]} castShadow>
      <boxGeometry args={[width, 0.6, 0.12]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

function GateSign() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#30343a";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#c5a858";
      context.lineWidth = 16;
      context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
      context.fillStyle = "#f3eee0";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "700 66px Arial, sans-serif";
      context.fillText("UNIVERSITAS MUHAMMADIYAH", canvas.width / 2, 96, 810);
      context.font = "700 76px Arial, sans-serif";
      context.fillText("SURAKARTA", canvas.width / 2, 176, 700);
    }
    const signTexture = new THREE.CanvasTexture(canvas);
    signTexture.colorSpace = THREE.SRGBColorSpace;
    signTexture.anisotropy = 4;
    return signTexture;
  }, []);

  return (
    <mesh position={[0, 4.28, 0.63]} castShadow>
      <planeGeometry args={[7.45, 1.22]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function GateRoof({ position, scale, color }: { position: [number, number, number]; scale: [number, number, number]; color: string }) {
  return (
    <mesh position={position} rotation={[0, Math.PI / 4, 0]} scale={scale} castShadow>
      <coneGeometry args={[1, 1, 4]} />
      <meshStandardMaterial color={color} flatShading roughness={0.9} />
    </mesh>
  );
}

export function CampusOneGate() {
  const gateX = -19;
  const gateZ = 26.5;
  const roofRed = "#a94f45";
  const pillar = "#e9e5d8";

  return (
    <group position={[gateX, worldSurfaceY(gateX, gateZ), gateZ]} rotation={worldSurfaceTilt(gateX, gateZ)}>
      {[-4.45, 4.45].map((x) => (
        <group key={`gate-side-${x}`} position={[x, 0, 0]}>
          <Box position={[0, 1.22, 0.35]} scale={[2.1, 2.44, 2.25]} color={pillar} radius={0.08} />
          <Box position={[0, 0.3, 1.5]} scale={[2.35, 0.6, 0.35]} color="#315f62" radius={0.04} />
          <Box position={[0, 1.45, 1.5]} scale={[1.15, 0.72, 0.18]} color="#49616a" radius={0.025} />
          <GateRoof position={[0, 2.8, 0.35]} scale={[1.72, 0.7, 1.56]} color={roofRed} />

          <Box position={[x < 0 ? 0.88 : -0.88, 2.15, 0]} scale={[0.52, 4.3, 0.72]} color={pillar} radius={0.055} />
          <Box position={[x < 0 ? 0.88 : -0.88, 0.32, 0]} scale={[0.72, 0.64, 0.9]} color="#667a72" radius={0.045} />
          <mesh position={[x < 0 ? 0.88 : -0.88, 3.03, 0.48]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <boxGeometry args={[0.34, 0.34, 0.12]} />
            <meshStandardMaterial color="#d0ab4d" roughness={0.76} />
          </mesh>
        </group>
      ))}

      <Box position={[0, 4.28, 0]} scale={[8.05, 1.46, 1.05]} color="#eee9dc" radius={0.08} />
      <Box position={[0, 4.28, 0.56]} scale={[7.62, 1.22, 0.12]} color="#30343a" radius={0.035} />
      <GateSign />
      <Box position={[0, 3.5, 0]} scale={[8.45, 0.18, 1.12]} color="#c4a654" radius={0.035} />
      <mesh position={[0, 5.13, 0.53]} rotation={[-0.36, 0, 0]} castShadow>
        <boxGeometry args={[11.85, 0.18, 1.48]} />
        <meshStandardMaterial color={roofRed} flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0, 5.13, -0.53]} rotation={[0.36, 0, 0]} castShadow>
        <boxGeometry args={[11.85, 0.18, 1.48]} />
        <meshStandardMaterial color={roofRed} flatShading roughness={0.9} />
      </mesh>
      <Box position={[0, 5.42, 0]} scale={[11.65, 0.14, 0.2]} color="#d0ab4d" radius={0.03} />

      {[-4.72, 4.72].map((x) => (
        <group key={`gate-tower-${x}`} position={[x, 5.38, 0]}>
          <mesh position={[0, 0.54, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.32, 1.18, 1.15]} castShadow>
            <cylinderGeometry args={[0.5, 0.88, 1.15, 4]} />
            <meshStandardMaterial color={roofRed} flatShading roughness={0.9} />
          </mesh>
          <Box position={[0, 1.2, 0]} scale={[0.62, 0.16, 0.62]} color="#d0ab4d" radius={0.025} />
        </group>
      ))}

      {[-3.65, 3.65].map((x) => (
        <group key={`gate-emblem-${x}`} position={[x, 4.28, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.34, 0.34, 0.1, 16]} />
            <meshStandardMaterial color="#d6bd55" roughness={0.62} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.12, 12]} />
            <meshStandardMaterial color="#315d88" roughness={0.55} />
          </mesh>
        </group>
      ))}

      <GateRoof position={[0, 5.93, -0.08]} scale={[0.62, 0.48, 0.62]} color="#3e6257" />
      <mesh position={[0, 6.46, -0.08]} castShadow>
        <coneGeometry args={[0.12, 0.52, 8]} />
        <meshStandardMaterial color="#d0ab4d" flatShading roughness={0.72} />
      </mesh>
    </group>
  );
}

function AcademicBuilding({ accent, floors = 3 }: { accent: string; floors?: number }) {
  const windows = Array.from({ length: floors }, (_, index) => 1.25 + index * 1.08);
  return (
    <group>
      <Box position={[0, (floors * 1.1) / 2, 0]} scale={[7.8, floors * 1.1, 4]} color={wall} />
      <Box position={[0, floors * 1.1 + 0.15, 0]} scale={[8.2, 0.34, 4.35]} color={accent} />
      {windows.map((y) => (
        <group key={y}>
          <WindowBand y={y} width={6.6} z={2.035} />
          <WindowBand y={y} width={6.6} z={-2.035} />
        </group>
      ))}
      <Box position={[0, 0.85, 2.12]} scale={[1.55, 1.7, 0.2]} color={dark} radius={0.04} />
      <Sign color={accent} />
    </group>
  );
}

function ILoveFkipLandmark() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 280;
    const context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.font = "900 230px Arial, sans-serif";
      context.fillStyle = "#c92032";
      context.fillText("I", 22, 142);

      context.beginPath();
      context.moveTo(205, 237);
      context.bezierCurveTo(35, 120, 95, 25, 205, 82);
      context.bezierCurveTo(315, 25, 375, 120, 205, 237);
      context.fill();

      context.fillStyle = "#f8f8f3";
      context.fillText("FKIP", 355, 142);
      context.fillStyle = "#c92032";
      context.fillText("UMS", 850, 142);
    }
    const landmarkTexture = new THREE.CanvasTexture(canvas);
    landmarkTexture.colorSpace = THREE.SRGBColorSpace;
    landmarkTexture.anisotropy = 4;
    return landmarkTexture;
  }, []);

  return (
    <group position={[0, 0, 3.5]}>
      <Box position={[0, 0.16, 0]} scale={[7.6, 0.32, 0.7]} color="#4d555b" radius={0.04} />
      {[-3.35, -2.05, -0.65, 0.75, 2.15, 3.35].map((x) => (
        <mesh key={x} position={[x, 0.92, -0.05]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 1.5, 6]} />
          <meshStandardMaterial color="#30383e" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 1.38, 0.08]} castShadow>
        <planeGeometry args={[7.4, 1.48]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.05} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Bookstore() {
  return (
    <group>
      <Box position={[0, 1.35, 0]} scale={[6.2, 2.7, 4]} color="#f5e9c7" />
      <Box position={[0, 2.9, 0]} scale={[6.7, 0.38, 4.45]} color={yellow} />
      <Box position={[0, 1.65, 2.08]} scale={[4.6, 1.25, 0.16]} color="#92c6d0" radius={0.04} />
      <Box position={[0, 0.72, 2.17]} scale={[1.3, 1.4, 0.18]} color={dark} radius={0.04} />
      <Sign width={3.6} color={blue} />
      <mesh position={[0, 3.35, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color={blue} flatShading />
      </mesh>
    </group>
  );
}

function PointedArchRib({
  width,
  shoulderY,
  peakY,
  baseY = 1.25,
  z = 2.43,
  thickness = 0.16,
}: {
  width: number;
  shoulderY: number;
  peakY: number;
  baseY?: number;
  z?: number;
  thickness?: number;
}) {
  const columnHeight = shoulderY - baseY;
  const archRise = peakY - shoulderY;
  const halfWidth = width / 2;
  const slantLength = Math.hypot(halfWidth, archRise);
  const slantAngle = Math.atan2(halfWidth, archRise);

  return (
    <group>
      {[-halfWidth, halfWidth].map((x) => (
        <Box
          key={x}
          position={[x, baseY + columnHeight / 2, z]}
          scale={[thickness, columnHeight, 0.18]}
          color="#e7dfce"
          radius={0.035}
        />
      ))}
      <mesh position={[-halfWidth / 2, shoulderY + archRise / 2, z]} rotation={[0, 0, -slantAngle]} castShadow>
        <boxGeometry args={[thickness, slantLength, 0.18]} />
        <meshStandardMaterial color="#e7dfce" roughness={0.76} />
      </mesh>
      <mesh position={[halfWidth / 2, shoulderY + archRise / 2, z]} rotation={[0, 0, slantAngle]} castShadow>
        <boxGeometry args={[thickness, slantLength, 0.18]} />
        <meshStandardMaterial color="#e7dfce" roughness={0.76} />
      </mesh>
    </group>
  );
}

function SitiWalidah() {
  const facadeBays = [-1.05, -0.7, -0.35, 0, 0.35, 0.7, 1.05];
  const floorBands = [2.05, 3.03, 4.01, 4.99, 5.97, 6.95];

  return (
    <group scale={[0.9, 0.84, 0.9]}>
      <mesh position={[0, 4.35, -0.16]} castShadow receiveShadow>
        <cylinderGeometry args={[6.55, 6.55, 7.75, 24]} />
        <meshStandardMaterial color="#e8e1d2" flatShading roughness={0.82} />
      </mesh>

      {facadeBays.map((angle, bayIndex) => {
        const isCenter = bayIndex === 3;
        const x = Math.sin(angle) * 6.42;
        const z = Math.cos(angle) * 6.42;
        return (
          <group key={angle} position={[x, 0, z]} rotation={[0, angle, 0]}>
            <Box position={[0, 4.35, 0]} scale={[2.05, 7.75, 0.42]} color="#e8e1d2" radius={0.06} />

            {floorBands.map((y) => (
              <group key={y}>
                <Box
                  position={[0, y, 0.235]}
                  scale={[1.64, 0.43, 0.12]}
                  color={isCenter ? "#75aeb9" : "#79aeb8"}
                  radius={0.025}
                />
                <Box position={[0, y - 0.34, 0.275]} scale={[1.92, 0.13, 0.16]} color="#f4eddd" radius={0.025} />
              </group>
            ))}

            {!isCenter && <PointedArchRib width={1.48} shoulderY={6.65} peakY={8.12} z={0.34} />}

            {[-0.68, -0.34, 0, 0.34, 0.68].map((finX) => (
              <Box
                key={finX}
                position={[finX, 8.08, 0.3]}
                scale={[0.1, 0.84, 0.2]}
                color="#d7d1c3"
                radius={0.02}
              />
            ))}
          </group>
        );
      })}

      <Box position={[0, 5.2, 6.53]} scale={[2.55, 6.15, 0.2]} color="#176b8c" radius={0.04} />
      <Box position={[0, 4.72, 6.66]} scale={[1.36, 5.15, 0.13]} color="#6fa7b1" radius={0.035} />
      {[-0.98, 0.98].flatMap((x) =>
        [3.05, 3.75, 4.45, 5.15, 5.85, 6.55, 7.25].map((y) => (
          <mesh key={`ornament-${x}-${y}`} position={[x, y, 6.67]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <boxGeometry args={[0.24, 0.24, 0.1]} />
            <meshStandardMaterial color="#8fc2c3" roughness={0.72} />
          </mesh>
        )),
      )}
      <PointedArchRib width={2.12} shoulderY={6.55} peakY={8.45} z={6.78} thickness={0.22} />

      {[-0.54, 0, 0.54].map((x) => (
        <Box key={`portal-${x}`} position={[x, 4.65, 6.81]} scale={[0.11, 5.1, 0.13]} color="#eee7d8" radius={0.02} />
      ))}
      {[-0.48, 0, 0.48].map((x, index) => (
        <group key={`lattice-${x}`}>
          <mesh position={[x, 6.06, 6.84]} rotation={[0, 0, -0.4 + index * 0.4]} castShadow>
            <boxGeometry args={[0.1, 3.15, 0.12]} />
            <meshStandardMaterial color="#eee7d8" roughness={0.72} />
          </mesh>
          <mesh position={[x, 6.06, 6.85]} rotation={[0, 0, 0.4 - index * 0.4]} castShadow>
            <boxGeometry args={[0.1, 3.15, 0.12]} />
            <meshStandardMaterial color="#eee7d8" roughness={0.72} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 8.64, -0.18]} castShadow receiveShadow>
        <cylinderGeometry args={[7.08, 7.08, 0.48, 32]} />
        <meshStandardMaterial color="#d6d0c4" flatShading roughness={0.78} />
      </mesh>
      <mesh position={[0, 8.91, -0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[5.82, 5.82, 0.12, 32]} />
        <meshStandardMaterial color="#aeb2ad" flatShading roughness={0.82} />
      </mesh>
      <mesh position={[0, 8.99, -0.18]} castShadow receiveShadow>
        <cylinderGeometry args={[4.55, 4.55, 0.1, 32]} />
        <meshStandardMaterial color="#d9d6ca" flatShading roughness={0.8} />
      </mesh>
      {facadeBays.map((angle) => (
        <group
          key={`roof-fascia-${angle}`}
          position={[Math.sin(angle) * 6.42, 8.38, Math.cos(angle) * 6.42]}
          rotation={[0, angle, 0]}
        >
          <Box position={[0, 0, 0.14]} scale={[2.08, 0.16, 0.28]} color="#90938f" radius={0.025} />
        </group>
      ))}

      <Box position={[0, 1.1, 7.1]} scale={[12.1, 0.3, 1.42]} color="#e2dac9" radius={0.1} />
      <Box position={[0, 0.7, 6.66]} scale={[4.2, 1.34, 0.18]} color="#24485b" radius={0.035} />
      <Box position={[0, 1.28, 7.75]} scale={[7.6, 0.27, 0.12]} color="#8a7052" radius={0.025} />
      {[-4.9, -3.2, 3.2, 4.9].map((x) => (
        <mesh key={`support-${x}`} position={[x, 0.64, 7]} rotation={[0, 0, x < 0 ? -0.32 : 0.32]} castShadow>
          <boxGeometry args={[0.22, 1.35, 0.28]} />
          <meshStandardMaterial color="#cfc7b8" roughness={0.8} />
        </mesh>
      ))}

      {[0, 1, 2, 3, 4].map((step) => (
        <Box
          key={`step-${step}`}
          position={[0, 0.07 + step * 0.07, 9.2 - step * 0.33]}
          scale={[11.2 - step * 0.34, 0.14, 0.72]}
          color={step % 2 === 0 ? "#bdb9ae" : "#d3cec2"}
          radius={0.025}
        />
      ))}

      <mesh position={[0, 1.5, 9.45]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 2.75, 8]} />
        <meshStandardMaterial color="#6f7473" roughness={0.65} />
      </mesh>
      <mesh position={[0.29, 2.32, 9.46]} castShadow>
        <planeGeometry args={[0.58, 0.38]} />
        <meshStandardMaterial color="#c5413b" side={2} />
      </mesh>
      <mesh position={[0.29, 2.13, 9.46]} castShadow>
        <planeGeometry args={[0.58, 0.38]} />
        <meshStandardMaterial color="#f4f0e8" side={2} />
      </mesh>
    </group>
  );
}

function Edutorium() {
  const facadeSegments = Array.from({ length: 28 }, (_, index) => {
    const angle = (index / 28) * Math.PI * 2;
    const wave = 0.34 + Math.sin(angle * 3 + 0.45) * 0.3;
    const top = 5.35;
    const bottom = 3.65 + wave;
    return { angle, height: top - bottom, y: (top + bottom) / 2 };
  });
  const lowerWindows = Array.from({ length: 24 }, (_, index) => (index / 24) * Math.PI * 2);
  const triangleAngles = [-1.22, -0.98, -0.74, -0.48, 0.48, 0.74, 0.98, 1.22];

  return (
    <group scale={[0.96, 0.96, 0.96]}>
      <mesh position={[0, 0.16, 0]} scale={[1, 1, 0.78]} receiveShadow>
        <cylinderGeometry args={[7.45, 7.7, 0.32, 32]} />
        <meshStandardMaterial color="#d5d2ca" flatShading roughness={0.88} />
      </mesh>

      <mesh position={[0, 0.55, 0]} scale={[1, 1, 0.78]} castShadow receiveShadow>
        <cylinderGeometry args={[6.85, 7.18, 0.78, 32]} />
        <meshStandardMaterial color="#a84f3f" flatShading roughness={0.86} />
      </mesh>

      <mesh position={[0, 1.65, 0]} scale={[1, 1, 0.78]} castShadow receiveShadow>
        <cylinderGeometry args={[6.68, 6.85, 1.72, 32]} />
        <meshStandardMaterial color="#eeeae0" flatShading roughness={0.82} />
      </mesh>

      {lowerWindows.map((angle, index) => (
        <group
          key={`edutorium-window-${index}`}
          position={[Math.sin(angle) * 6.72, 1.72, Math.cos(angle) * 5.28]}
          rotation={[0, angle, 0]}
        >
          <Box position={[0, 0, 0]} scale={[0.7, 0.72, 0.13]} color="#35586a" radius={0.025} />
        </group>
      ))}

      <mesh position={[0, 3.42, 0]} scale={[1, 1, 0.78]} castShadow receiveShadow>
        <cylinderGeometry args={[6.5, 6.5, 1.72, 32, 1, true]} />
        <meshStandardMaterial color="#168eaa" flatShading roughness={0.45} metalness={0.05} />
      </mesh>

      {facadeSegments.map(({ angle, height, y }, index) => (
        <group
          key={`edutorium-shell-${index}`}
          position={[Math.sin(angle) * 6.62, y, Math.cos(angle) * 5.15]}
          rotation={[0, angle, 0]}
        >
          <Box position={[0, 0, 0]} scale={[1.48, height, 0.2]} color="#d8d9d5" radius={0.035} />
        </group>
      ))}

      {triangleAngles.map((angle, index) => (
        <mesh
          key={`edutorium-triangle-${angle}`}
          position={[Math.sin(angle) * 6.75, 4.72 + (index % 2) * 0.28, Math.cos(angle) * 5.26]}
          rotation={[0, angle, index % 2 === 0 ? 0.25 : -0.25]}
          castShadow
        >
          <circleGeometry args={[0.24, 3]} />
          <meshStandardMaterial color="#286da0" side={2} roughness={0.55} />
        </mesh>
      ))}

      <mesh position={[0, 5.34, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.78]} castShadow>
        <torusGeometry args={[6.46, 0.42, 8, 32]} />
        <meshStandardMaterial color="#d8d9d6" flatShading roughness={0.68} />
      </mesh>
      <mesh position={[0, 5.42, 0]} scale={[1, 0.34, 0.78]} castShadow receiveShadow>
        <sphereGeometry args={[5.94, 28, 9, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#efeee8" flatShading roughness={0.82} />
      </mesh>
      <mesh position={[0, 5.48, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.78]} castShadow>
        <torusGeometry args={[5.96, 0.12, 6, 32]} />
        <meshStandardMaterial color="#aeb6b5" flatShading roughness={0.66} />
      </mesh>

      <group position={[0, 0, 5.25]}>
        <Box position={[0, 2.38, 0.52]} scale={[5.5, 0.32, 2.62]} color="#e7e8e3" radius={0.08} />
        {[-1.82, -0.92, 0, 0.92, 1.82].map((x, columnIndex) =>
          [-0.42, 0.42].map((z, rowIndex) => (
            <mesh
              key={`canopy-tile-${x}-${z}`}
              position={[x, 2.56, z + 0.52]}
              rotation={[-Math.PI / 2, 0, Math.PI / 4]}
            >
              <planeGeometry args={[0.58, 0.58]} />
              <meshStandardMaterial color={(columnIndex + rowIndex) % 2 === 0 ? "#5aa9bb" : "#f5f2e9"} side={2} />
            </mesh>
          )),
        )}

        {[-2.35, -1.17, 0, 1.17, 2.35].map((x, index) => (
          <group key={`canopy-lattice-${x}`}>
            <mesh position={[x, 1.28, 1.82]} rotation={[0, 0, index % 2 === 0 ? 0.48 : -0.48]} castShadow>
              <boxGeometry args={[0.13, 2.45, 0.16]} />
              <meshStandardMaterial color="#f0eee8" roughness={0.74} />
            </mesh>
            <mesh position={[x, 1.28, 1.83]} rotation={[0, 0, index % 2 === 0 ? -0.48 : 0.48]} castShadow>
              <boxGeometry args={[0.13, 2.45, 0.16]} />
              <meshStandardMaterial color="#f0eee8" roughness={0.74} />
            </mesh>
          </group>
        ))}

        {[-2.65, 2.65].map((x) => (
          <Box key={`canopy-post-${x}`} position={[x, 1.08, 1.72]} scale={[0.2, 2.16, 0.22]} color="#dedbd2" radius={0.025} />
        ))}

        {[0, 1, 2, 3].map((step) => (
          <mesh key={`edutorium-step-${step}`} position={[0, 0.05 + step * 0.07, 3.28 + step * 0.28]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[2.5 - step * 0.12, 4.35 - step * 0.18, 28, 1, 0, Math.PI]} />
            <meshStandardMaterial color={step % 2 === 0 ? "#c9c6bd" : "#dfdcd3"} side={2} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {[-1, 1].map((side) => {
        const angle = side * 0.72;
        return (
          <Box
            key={`edutorium-brick-${side}`}
            position={[Math.sin(angle) * 6.55, 0.82, Math.cos(angle) * 5.05]}
            scale={[0.8, 1.35, 0.7]}
            color="#a64e3e"
            radius={0.04}
          />
        );
      })}
    </group>
  );
}

function Minaret({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.44, 4.4, 10]} />
        <meshStandardMaterial color="#e8e1cf" flatShading />
      </mesh>
      <mesh position={[0, 4.55, 0]} castShadow>
        <coneGeometry args={[0.72, 1.5, 10]} />
        <meshStandardMaterial color={green} flatShading />
      </mesh>
      <mesh position={[0, 3.75, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.18, 10]} />
        <meshStandardMaterial color={yellow} />
      </mesh>
    </group>
  );
}

function Mosque({ modern = false }: { modern?: boolean }) {
  return (
    <group>
      <Box position={[0, 1.25, 0]} scale={[6.3, 2.5, 5]} color={modern ? "#e9e3d2" : "#f3ead4"} />
      <mesh position={[0, 3.1, 0]} scale={[1.25, 0.75, 1]} castShadow>
        <sphereGeometry args={[2.1, modern ? 12 : 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={modern ? "#4a8c75" : "#3b765f"} flatShading />
      </mesh>
      <mesh position={[0, 4.65, 0]} castShadow>
        <coneGeometry args={[0.34, 1.25, 8]} />
        <meshStandardMaterial color={yellow} flatShading />
      </mesh>
      <Minaret position={[modern ? -3.4 : 3.25, 0, -1.7]} />
      {modern && <Minaret position={[3.4, 0, -1.7]} />}
      {[-1.8, 0, 1.8].map((x) => (
        <mesh key={x} position={[x, 1.3, 2.54]} castShadow>
          <boxGeometry args={[1.05, 1.65, 0.12]} />
          <meshStandardMaterial color="#79b7b7" />
        </mesh>
      ))}
    </group>
  );
}

function Library() {
  return (
    <group>
      <Box position={[0, 2.1, 0]} scale={[7, 4.2, 4.5]} color="#e8dfca" />
      <Box position={[-2.7, 2.2, 2.32]} scale={[0.55, 4.1, 0.24]} color={blue} radius={0.04} />
      {[1.1, 2.15, 3.2].map((y) => <WindowBand key={y} y={y} width={4.5} z={2.28} />)}
      <Box position={[1.5, 4.45, 0]} scale={[4.2, 0.45, 4.8]} color="#6c63a8" />
      <Box position={[0, 0.8, 2.42]} scale={[1.3, 1.6, 0.24]} color={dark} radius={0.04} />
    </group>
  );
}

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.6, 7]} />
        <meshStandardMaterial color="#77513e" flatShading />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial color="#4e9668" flatShading />
      </mesh>
      <mesh position={[0.6, 1.9, 0.2]} castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#65a979" flatShading />
      </mesh>
    </group>
  );
}

function SwimmingDuck({ radius, speed, phase, scale = 1 }: { radius: number; speed: number; phase: number; scale?: number }) {
  const duck = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!duck.current) return;
    const angle = clock.elapsedTime * speed + phase;
    duck.current.position.set(Math.cos(angle) * radius, 0.22, Math.sin(angle) * radius * 0.62);
    const velocityX = -Math.sin(angle) * radius * speed;
    const velocityZ = Math.cos(angle) * radius * 0.62 * speed;
    duck.current.rotation.y = Math.atan2(-velocityX, -velocityZ);
    duck.current.position.y += Math.sin(clock.elapsedTime * 3 + phase) * 0.025;
  });

  return (
    <group ref={duck} scale={scale}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.16, 0]}>
        <torusGeometry args={[0.48, 0.035, 6, 18]} />
        <meshBasicMaterial color="#d8f4f5" transparent opacity={0.6} />
      </mesh>
      <mesh castShadow scale={[1, 0.68, 1.3]}>
        <sphereGeometry args={[0.32, 10, 7]} />
        <meshStandardMaterial color="#f4f0d7" flatShading />
      </mesh>
      <mesh position={[0, 0.34, -0.28]} castShadow>
        <sphereGeometry args={[0.2, 9, 6]} />
        <meshStandardMaterial color="#f4f0d7" flatShading />
      </mesh>
      <mesh position={[0, 0.31, -0.52]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.1, 0.28, 4]} />
        <meshStandardMaterial color="#e99a38" flatShading />
      </mesh>
      <mesh position={[-0.24, 0.04, 0.02]} rotation={[0.2, 0, -0.42]} castShadow>
        <sphereGeometry args={[0.2, 8, 5]} />
        <meshStandardMaterial color="#dfd9bd" flatShading />
      </mesh>
    </group>
  );
}

function Lakeside() {
  return (
    <group>
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[7, 32]} />
        <meshStandardMaterial color="#5eabc0" roughness={0.35} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.72, 7.05, 32]} />
        <meshStandardMaterial color="#d7c58c" roughness={1} />
      </mesh>
      <SwimmingDuck radius={3.7} speed={0.34} phase={0} />
      <SwimmingDuck radius={2.6} speed={-0.27} phase={2.4} scale={0.82} />
      <Box position={[6.6, 1.05, 0.5]} scale={[4.2, 2.1, 3.3]} color="#f0d893" />
      <mesh position={[6.6, 2.45, 0.5]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[3.2, 1.4, 4]} />
        <meshStandardMaterial color={red} flatShading />
      </mesh>
      <Tree position={[3, 0, 9]} scale={0.9} />
      <Tree position={[10, 0, 5]} scale={0.72} />
    </group>
  );
}

function LimasanRoof() {
  const geometry = useMemo(() => {
    const roof = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Bidang depan
      -4.15, 0, 2.75, 4.15, 0, 2.75, 1.45, 1.75, 0, -1.45, 1.75, 0,
      // Bidang belakang
      4.15, 0, -2.75, -4.15, 0, -2.75, -1.45, 1.75, 0, 1.45, 1.75, 0,
      // Sisi kiri dan kanan berbentuk segitiga
      -4.15, 0, -2.75, -4.15, 0, 2.75, -1.45, 1.75, 0,
      4.15, 0, 2.75, 4.15, 0, -2.75, 1.45, 1.75, 0,
    ]);
    roof.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    roof.setIndex([
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10,
      11, 12, 13,
    ]);
    roof.computeVertexNormals();
    return roof;
  }, []);

  return (
    <group position={[0, 2.95, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#8f493c" roughness={0.92} flatShading side={THREE.DoubleSide} />
      </mesh>
      <Box position={[0, -0.06, 0]} scale={[8.45, 0.16, 5.65]} color="#684238" radius={0.04} />
      <mesh position={[0, 1.78, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 3.05, 8]} />
        <meshStandardMaterial color="#d0a24e" roughness={0.75} />
      </mesh>
    </group>
  );
}

function Auditorium() {
  return (
    <group>
      <Box position={[0, 1.45, 0]} scale={[7.4, 2.9, 4.7]} color="#e7dcc6" />
      <LimasanRoof />
      <Box position={[0, 1.05, 2.47]} scale={[2.3, 2.1, 0.22]} color={dark} radius={0.04} />
      <Sign width={3.7} color="#c0674b" />
    </group>
  );
}

type StreetStallKind = "tea" | "angkringan" | "coffee" | "batik";

export const STREET_STALLS: Array<{
  kind: StreetStallKind;
  label: string;
  position: [number, number, number];
  rotation: number;
}> = [
  { kind: "tea", label: "ES TEH SOLO", position: [-5, 0, -29], rotation: 0 },
  { kind: "angkringan", label: "ANGKRINGAN", position: [5, 0, 5], rotation: 0 },
  { kind: "coffee", label: "ES KOPI", position: [23.2, 0, 28], rotation: 0 },
  { kind: "batik", label: "BATIK SOLO", position: [-5, 0, -35], rotation: 0 },
];

function StallSign({ label, color, back = false }: { label: string; color: string; back?: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#f8e8b5";
      context.lineWidth = 10;
      context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
      context.fillStyle = "#fff9e9";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "800 54px Arial, sans-serif";
      context.fillText(label, canvas.width / 2, canvas.height / 2, 440);
    }
    const sign = new THREE.CanvasTexture(canvas);
    sign.colorSpace = THREE.SRGBColorSpace;
    return sign;
  }, [color, label]);

  return (
    <mesh position={[0, 2.82, back ? -1.72 : 1.72]} rotation={[0, back ? Math.PI : 0, 0]} castShadow>
      <planeGeometry args={[2.8, 0.7]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function CartWheel({ x }: { x: number }) {
  return (
    <mesh position={[x, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[0.42, 0.42, 0.16, 12]} />
      <meshStandardMaterial color="#292827" roughness={0.95} flatShading />
    </mesh>
  );
}

function StreetStall({ kind, label }: { kind: StreetStallKind; label: string }) {
  const theme = kind === "tea" ? "#19967b" : kind === "coffee" ? "#704637" : kind === "batik" ? "#315d88" : "#9b4e36";
  const wood = "#805238";

  return (
    <group>
      <Box position={[0, 1.05, 0]} scale={[2.8, 1.35, 1.65]} color={kind === "angkringan" ? wood : "#eee2c8"} radius={0.08} />
      <Box position={[0, 1.78, 0]} scale={[3.05, 0.18, 1.9]} color="#d6b775" radius={0.04} />
      <CartWheel x={-1.18} />
      <CartWheel x={1.18} />

      {[-1.25, 1.25].map((x) => (
        <mesh key={x} position={[x, 2.45, -0.68]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 2.65, 6]} />
          <meshStandardMaterial color={wood} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 3.7, 0]} rotation={[0, Math.PI / 4, 0]} scale={[2.45, 0.65, 1.65]} castShadow>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color={theme} roughness={0.9} flatShading />
      </mesh>
      <StallSign label={label} color={theme} />
      <StallSign label={label} color={theme} back />

      {kind === "tea" && (
        <group position={[0.62, 2.1, 0.2]}>
          <mesh castShadow><cylinderGeometry args={[0.36, 0.3, 0.72, 10]} /><meshStandardMaterial color="#e7c26a" transparent opacity={0.78} /></mesh>
          <mesh position={[0, 0.48, 0]}><cylinderGeometry args={[0.05, 0.05, 0.7, 6]} /><meshStandardMaterial color="#ecf3e9" /></mesh>
        </group>
      )}
      {kind === "coffee" && (
        <group position={[0.55, 2.08, 0.15]}>
          <mesh castShadow><cylinderGeometry args={[0.36, 0.42, 0.55, 10]} /><meshStandardMaterial color="#b9b5aa" metalness={0.45} roughness={0.35} /></mesh>
          <mesh position={[-0.52, -0.05, 0]}><cylinderGeometry args={[0.18, 0.15, 0.42, 10]} /><meshStandardMaterial color="#e7ddd0" /></mesh>
          <mesh position={[0.52, -0.05, 0]}><cylinderGeometry args={[0.18, 0.15, 0.42, 10]} /><meshStandardMaterial color="#e7ddd0" /></mesh>
        </group>
      )}
      {kind === "angkringan" && (
        <>
          <mesh position={[0.55, 2.12, 0.15]} castShadow><cylinderGeometry args={[0.33, 0.4, 0.48, 10]} /><meshStandardMaterial color="#6d6b63" metalness={0.25} /></mesh>
          {[-0.65, -0.35, -0.05].map((x) => <mesh key={x} position={[x, 2.18, 0.25]} rotation={[0.2, 0, 0.18]}><cylinderGeometry args={[0.025, 0.025, 0.9, 5]} /><meshStandardMaterial color="#c69a57" /></mesh>)}
          <Box position={[0, 0.34, 1.55]} scale={[2.4, 0.32, 0.48]} color={wood} radius={0.04} />
        </>
      )}
      {kind === "batik" && (
        <group position={[0, 2.2, 0.1]}>
          {[-0.75, 0, 0.75].map((x, index) => (
            <mesh key={x} position={[x, 0, 0.45]} castShadow>
              <boxGeometry args={[0.58, 1.05, 0.08]} />
              <meshStandardMaterial color={["#c86b45", "#e0b94f", "#477a72"][index]} roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

export function CampusStreetStalls() {
  return (
    <group>
      {STREET_STALLS.map((stall) => {
        const [x, , z] = stall.position;
        return (
          <group key={stall.kind} position={[x, worldSurfaceY(x, z), z]} rotation={worldSurfaceTilt(x, z)}>
            <group rotation={[0, stall.rotation, 0]} scale={0.72}>
              <StreetStall kind={stall.kind} label={stall.label} />
            </group>
          </group>
        );
      })}
    </group>
  );
}

function PtiCreativeLogo() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 420;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#f0f1ef";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#116bd2";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "900 250px Arial, sans-serif";
      context.fillText("PTI", 555, 160);

      context.fillStyle = "#ffd51f";
      context.beginPath();
      context.arc(830, 105, 88, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = "#116bd2";
      context.beginPath();
      context.moveTo(850, 95);
      context.lineTo(948, 168);
      context.lineTo(900, 176);
      context.lineTo(924, 224);
      context.lineTo(892, 240);
      context.lineTo(868, 190);
      context.lineTo(832, 224);
      context.closePath();
      context.fill();

      context.font = "800 104px Arial, sans-serif";
      context.letterSpacing = "26px";
      context.fillText("KREATIF", 580, 335);
    }
    const logoTexture = new THREE.CanvasTexture(canvas);
    logoTexture.colorSpace = THREE.SRGBColorSpace;
    logoTexture.anisotropy = 4;
    return logoTexture;
  }, []);

  return (
    <mesh position={[0.62, 2.03, 1.94]} castShadow>
      <planeGeometry args={[3.2, 1.12]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function PtiOffice() {
  return (
    <group>
      <Box position={[0, 1.45, 0]} scale={[5.2, 2.9, 3.6]} color="#ece8dd" radius={0.08} />
      <Box position={[0, 3.04, 0]} scale={[5.55, 0.32, 3.95]} color="#176bc1" radius={0.06} />
      <Box position={[-1.72, 1.1, 1.89]} scale={[1.15, 1.75, 0.18]} color="#173456" radius={0.035} />
      <Box position={[-1.72, 2.35, 1.93]} scale={[1.45, 0.32, 0.16]} color="#f3c84b" radius={0.025} />
      <PtiCreativeLogo />
      {[-1.72, 1.72].map((x) => (
        <Box key={`office-side-window-${x}`} position={[x, 1.15, -1.86]} scale={[1.18, 1.15, 0.16]} color="#8fc4cf" radius={0.035} />
      ))}
      <Box position={[0, 0.18, 2.24]} scale={[5.8, 0.25, 0.85]} color="#d3c9b7" radius={0.04} />
    </group>
  );
}

function GriyaMahasiswaSign() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 320;
    const context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#9d2738";
      context.textAlign = "left";
      context.textBaseline = "middle";
      context.font = "900 132px Arial, sans-serif";
      context.fillText("GM", 28, 93);
      context.font = "800 102px Arial, sans-serif";
      context.fillText("GRIYA MAHASISWA", 28, 230, 1120);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, []);
  return (
    <mesh position={[1.1, 3.46, 2.53]} castShadow>
      <planeGeometry args={[5.5, 1.45]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

function GriyaMahasiswa() {
  const floors = [1.6, 2.75, 3.9, 5.05];
  return (
    <group>
      <Box position={[0, 3.25, 0]} scale={[8.6, 6.5, 4.8]} color="#e6e5df" radius={0.08} />
      <Box position={[1.35, 5.72, 0]} scale={[5.9, 1.15, 4.95]} color="#68727e" radius={0.05} />
      {floors.map((y) => (
        <Box key={y} position={[1.28, y, 2.46]} scale={[5.55, 0.58, 0.16]} color="#466a78" radius={0.025} />
      ))}
      {[-0.9, 0.2, 1.3, 2.4, 3.5].map((x) => (
        <Box key={`gm-window-frame-${x}`} position={[x, 3.1, 2.56]} scale={[0.08, 4.7, 0.12]} color="#d9dcd8" radius={0.015} />
      ))}

      <Box position={[-3.05, 3.22, 2.52]} scale={[2.15, 5.9, 0.18]} color="#263a46" radius={0.025} />
      {[1.15, 2.25, 3.35, 4.45, 5.55].flatMap((y, row) =>
        [-3.72, -3.28, -2.84, -2.4].map((x, column) => (
          <group key={`gm-lattice-${row}-${column}`} position={[x, y, 2.67]}>
            <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
              <boxGeometry args={[0.12, 0.86, 0.1]} />
              <meshStandardMaterial color="#f1f0e9" roughness={0.78} />
            </mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]} castShadow>
              <boxGeometry args={[0.12, 0.86, 0.1]} />
              <meshStandardMaterial color="#f1f0e9" roughness={0.78} />
            </mesh>
          </group>
        )),
      )}

      <Box position={[0.85, 1.72, 3.08]} scale={[5.8, 0.3, 1.35]} color="#cdd1d0" radius={0.045} />
      {[-1.65, 2.7].map((x) => (
        <mesh key={`gm-column-${x}`} position={[x, 0.83, 3.22]} castShadow>
          <cylinderGeometry args={[0.13, 0.15, 1.66, 10]} />
          <meshStandardMaterial color="#7f898d" flatShading roughness={0.65} />
        </mesh>
      ))}
      <Box position={[0.8, 0.68, 2.53]} scale={[2.25, 1.35, 0.18]} color="#18354a" radius={0.025} />
      <GriyaMahasiswaSign />
      <Box position={[0, 6.62, 0]} scale={[8.9, 0.28, 5.05]} color="#525d68" radius={0.05} />
    </group>
  );
}

function MedicalCenterSign() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 320;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#f7f6ef";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#23886f";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "900 150px Arial, sans-serif";
      context.fillText("MMC", canvas.width / 2, 115);
      context.font = "700 48px Arial, sans-serif";
      context.fillText("MUHAMMADIYAH MEDICAL CENTRE", canvas.width / 2, 242, 920);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, []);

  return (
    <mesh position={[0.55, 2.05, 1.94]} castShadow>
      <planeGeometry args={[3.25, 1.02]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function MedicalCenter() {
  return (
    <group>
      <Box position={[0, 1.42, 0]} scale={[5.2, 2.84, 3.6]} color="#f0ede3" radius={0.08} />
      <Box position={[0, 3.02, 0]} scale={[5.55, 0.34, 3.95]} color="#23886f" radius={0.055} />
      <Box position={[-1.75, 1.08, 1.9]} scale={[1.12, 1.75, 0.2]} color="#24556a" radius={0.035} />
      <MedicalCenterSign />
      {[-1.45, 0, 1.45].map((x) => (
        <Box key={`mmc-window-${x}`} position={[x, 1.02, -1.86]} scale={[0.95, 1.12, 0.16]} color="#8fc8cf" radius={0.03} />
      ))}
      <group position={[-1.75, 2.38, 2.03]}>
        <Box position={[0, 0, 0]} scale={[0.22, 0.72, 0.12]} color="#e34b48" radius={0.02} />
        <Box position={[0, 0, 0.01]} scale={[0.72, 0.22, 0.14]} color="#e34b48" radius={0.02} />
      </group>
      <Box position={[0, 0.16, 2.25]} scale={[5.8, 0.25, 0.85]} color="#d2cbbb" radius={0.04} />
    </group>
  );
}

function HospitalSign() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#f2f3ef";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "700 72px Arial, sans-serif";
      context.fillStyle = "#245a61";
      context.fillText("RS UMS AR FACHRUDDIN", canvas.width / 2, 82, 920);
      context.font = "900 112px Arial, sans-serif";
      context.fillStyle = "#c83d37";
      context.fillText("IGD", canvas.width / 2, 176);
    }
    const signTexture = new THREE.CanvasTexture(canvas);
    signTexture.colorSpace = THREE.SRGBColorSpace;
    signTexture.anisotropy = 4;
    return signTexture;
  }, []);

  return (
    <mesh position={[2.45, 1.12, 4.18]} castShadow>
      <planeGeometry args={[3.45, 0.86]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Hospital() {
  const facadeColumns = [-3.55, -2.7, -1.85, -1, -0.15, 0.7, 1.55, 2.4, 3.25];
  const facadeRows = [1.55, 2.35, 3.15, 3.95, 4.75, 5.55];
  const braceColor = "#969c9d";

  return (
    <group>
      <Box position={[0, 3.45, 0]} scale={[9.5, 6.9, 5.7]} color="#d7dbd8" radius={0.08} />
      <Box position={[0, 3.55, 2.91]} scale={[8.25, 5.65, 0.16]} color="#68aeb2" radius={0.025} />

      {facadeColumns.map((x) => (
        <Box key={`hospital-column-${x}`} position={[x, 3.55, 3.04]} scale={[0.1, 5.55, 0.12]} color="#dce4e1" radius={0.015} />
      ))}
      {facadeRows.map((y) => (
        <Box key={`hospital-row-${y}`} position={[0, y, 3.04]} scale={[8.15, 0.1, 0.12]} color="#dce4e1" radius={0.015} />
      ))}

      <mesh position={[-2.45, 4.62, 3.2]} rotation={[0, 0, -0.53]} castShadow>
        <boxGeometry args={[5.9, 0.72, 0.3]} />
        <meshStandardMaterial color={braceColor} roughness={0.76} />
      </mesh>
      <mesh position={[2.28, 4.56, 3.21]} rotation={[0, 0, 0.52]} castShadow>
        <boxGeometry args={[5.7, 0.72, 0.3]} />
        <meshStandardMaterial color={braceColor} roughness={0.76} />
      </mesh>
      <mesh position={[-0.75, 2.83, 3.22]} rotation={[0, 0, -0.58]} castShadow>
        <boxGeometry args={[5.75, 0.72, 0.3]} />
        <meshStandardMaterial color={braceColor} roughness={0.76} />
      </mesh>
      <mesh position={[3.05, 2.65, 3.22]} rotation={[0, 0, 0.63]} castShadow>
        <boxGeometry args={[3.9, 0.72, 0.3]} />
        <meshStandardMaterial color={braceColor} roughness={0.76} />
      </mesh>

      <mesh position={[-5.05, 3.35, -0.15]} castShadow receiveShadow>
        <cylinderGeometry args={[0.72, 0.86, 6.7, 14]} />
        <meshStandardMaterial color="#e6e7e2" flatShading roughness={0.82} />
      </mesh>
      {[1.5, 2.35, 3.2, 4.05, 4.9, 5.75].map((y) => (
        <Box key={`hospital-side-window-${y}`} position={[4.81, y, 0]} scale={[0.12, 0.42, 3.9]} color="#76aeb1" radius={0.02} />
      ))}

      <mesh position={[0, 7.05, -1.32]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[9.65, 0.32, 3.05]} />
        <meshStandardMaterial color="#eef0ed" roughness={0.74} />
      </mesh>
      <mesh position={[0, 7.05, 1.32]} rotation={[-0.08, 0, 0]} castShadow>
        <boxGeometry args={[9.65, 0.32, 3.05]} />
        <meshStandardMaterial color="#eef0ed" roughness={0.74} />
      </mesh>

      <Box position={[2.45, 0.82, 3.7]} scale={[3.65, 0.42, 1.7]} color="#f1f2ef" radius={0.05} />
      {[-1.25, 1.25].map((x) => (
        <Box key={`hospital-canopy-${x}`} position={[2.45 + x, 0.42, 4.18]} scale={[0.12, 0.84, 0.12]} color="#8e9695" radius={0.02} />
      ))}
      <HospitalSign />

      <group position={[-3.62, 5.82, 3.26]}>
        <Box position={[0, 0, 0]} scale={[0.34, 1.3, 0.16]} color="#cf3e3a" radius={0.025} />
        <Box position={[0, 0, 0.02]} scale={[1.3, 0.34, 0.18]} color="#cf3e3a" radius={0.025} />
      </group>
    </group>
  );
}

export function CampusBuilding({ location }: { location: CampusLocation }) {
  let building: React.ReactNode;

  switch (location.kind) {
    case "bookstore":
      building = <Bookstore />;
      break;
    case "academic-blue":
      building = <AcademicBuilding accent={blue} floors={3} />;
      break;
    case "academic-yellow":
      building = <AcademicBuilding accent={yellow} floors={4} />;
      break;
    case "academic-red":
      building = (
        <>
          <AcademicBuilding accent={red} floors={3} />
          <ILoveFkipLandmark />
        </>
      );
      break;
    case "pti-office":
      building = <PtiOffice />;
      break;
    case "medical-center":
      building = <MedicalCenter />;
      break;
    case "student-center":
      building = <GriyaMahasiswa />;
      break;
    case "siti-walidah":
      building = <SitiWalidah />;
      break;
    case "edutorium":
      building = <Edutorium />;
      break;
    case "hospital":
      building = <Hospital />;
      break;
    case "mosque-modern":
      building = <Mosque modern />;
      break;
    case "library":
      building = <Library />;
      break;
    case "lakeside":
      building = <Lakeside />;
      break;
    case "auditorium":
      building = <Auditorium />;
      break;
    case "mosque-classic":
      building = <Mosque />;
      break;
  }

  return (
    <group
      position={[location.position[0], worldSurfaceY(location.position[0], location.position[2]), location.position[2]]}
      rotation={worldSurfaceTilt(location.position[0], location.position[2])}
    >
      <group rotation={[0, location.rotation ?? 0, 0]}>{building}</group>
    </group>
  );
}

function SoccerGoal({ z, rotationY = 0 }: { z: number; rotationY?: number }) {
  return (
    <group position={[0, 0, z]} rotation={[0, rotationY, 0]}>
      {[-1.18, 1.18].map((x) => (
        <Box key={x} position={[x, 0.62, 0]} scale={[0.1, 1.24, 0.1]} color="#f6f5e9" radius={0.015} />
      ))}
      <Box position={[0, 1.22, 0]} scale={[2.46, 0.1, 0.1]} color="#f6f5e9" radius={0.015} />
      {[-0.8, 0, 0.8].map((x) => (
        <mesh key={`goal-net-${x}`} position={[x, 0.62, -0.34]}>
          <boxGeometry args={[0.025, 1.12, 0.72]} />
          <meshStandardMaterial color="#dce5df" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function BasketballHoop({ z, rotationY = 0 }: { z: number; rotationY?: number }) {
  return (
    <group position={[0, 0, z]} rotation={[0, rotationY, 0]}>
      <Box position={[0, 1.35, -0.46]} scale={[0.13, 2.7, 0.13]} color="#3c4c52" radius={0.02} />
      <Box position={[0, 2.46, -0.08]} scale={[1.28, 0.78, 0.1]} color="#f3f1df" radius={0.025} />
      <mesh position={[0, 2.14, 0.35]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.32, 0.045, 8, 20]} />
        <meshStandardMaterial color="#e66a35" roughness={0.72} />
      </mesh>
    </group>
  );
}

export function CampusSportsCourts() {
  const soccerX = 3.8;
  const basketX = 12;
  const z = -12;
  return (
    <group>
      <group position={[soccerX, worldSurfaceY(soccerX, z) + 0.08, z]} rotation={worldSurfaceTilt(soccerX, z)}>
        <Box position={[0, 0.04, 0]} scale={[7.4, 0.12, 11]} color="#4a9a67" radius={0.12} />
        <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.12, 32]} />
          <meshBasicMaterial color="#f4f1d8" side={THREE.DoubleSide} />
        </mesh>
        <Box position={[0, 0.115, 0]} scale={[0.07, 0.025, 10.55]} color="#f4f1d8" radius={0.005} />
        {[-3.48, 3.48].map((x) => <Box key={`soccer-side-${x}`} position={[x, 0.115, 0]} scale={[0.07, 0.025, 10.55]} color="#f4f1d8" radius={0.005} />)}
        {[-5.25, 5.25].map((goalZ) => <Box key={`soccer-end-${goalZ}`} position={[0, 0.115, goalZ]} scale={[7.02, 0.025, 0.07]} color="#f4f1d8" radius={0.005} />)}
        <SoccerGoal z={-5.18} />
        <SoccerGoal z={5.18} rotationY={Math.PI} />
        <mesh position={[0.3, 0.28, 1.2]} castShadow><sphereGeometry args={[0.2, 10, 7]} /><meshStandardMaterial color="#f5f1dc" flatShading /></mesh>
      </group>

      <group position={[basketX, worldSurfaceY(basketX, z) + 0.08, z]} rotation={worldSurfaceTilt(basketX, z)}>
        <Box position={[0, 0.04, 0]} scale={[7, 0.12, 11]} color="#3c83b8" radius={0.12} />
        <Box position={[0, 0.115, 0]} scale={[0.07, 0.025, 10.55]} color="#f3cf55" radius={0.005} />
        {[-3.28, 3.28].map((x) => <Box key={`basket-side-${x}`} position={[x, 0.115, 0]} scale={[0.07, 0.025, 10.55]} color="#f3cf55" radius={0.005} />)}
        {[-5.25, 5.25].map((endZ) => <Box key={`basket-end-${endZ}`} position={[0, 0.115, endZ]} scale={[6.62, 0.025, 0.07]} color="#f3cf55" radius={0.005} />)}
        <mesh position={[0, 0.116, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[1.02, 1.09, 32]} /><meshBasicMaterial color="#f3cf55" side={THREE.DoubleSide} /></mesh>
        <BasketballHoop z={-4.72} />
        <BasketballHoop z={4.72} rotationY={Math.PI} />
        <mesh position={[-0.8, 0.27, -0.6]} castShadow><sphereGeometry args={[0.2, 10, 7]} /><meshStandardMaterial color="#dc7337" flatShading /></mesh>
      </group>
    </group>
  );
}

export function CampusTrees() {
  const trees: Array<[number, number, number, number]> = [
    // Entrance boulevard along West Road (x = -19, road width 5.5 => edges at -21.75 and -16.25)
    [-24.5, 0, 36, 0.9],
    [-28, 0, 29, 0.85],
    [-24.5, 0, 20, 0.9],
    [-24.5, 0, 14.5, 0.8],
    [-13.5, 0, 36, 0.9],
    [-13.5, 0, 28, 0.85],
    [-11, 0, 24, 0.9],
    [-13.5, 0, 14.5, 0.8],

    // Main cross-road roadside (road at z = 10, width 6 => edges at z = 7 and z = 13)
    // South roadside (z <= 5.2)
    [-39, 0, 5, 0.9],
    [-32, 0, 5, 0.85],
    [-24.5, 0, 5, 0.8],
    [-16, 0, 4, 0.85],
    [7, 0, 5, 0.9],
    [3, 0, 3, 0.85],
    [15, 0, 3, 0.8],
    [24.5, 0, 5, 0.85],
    [33, 0, 5, 0.8],
    [40, 0, 5, 0.9],
    // North roadside (z >= 14.8)
    [-38, 0, 15, 0.85],
    [-4, 0, 20, 0.88],
    [4, 0, 15.5, 0.85],
    [34, 0, 15.5, 0.85],

    // Kampus 1 sector (Bookstore, Gedung B, C, E, Auditorium)
    [-40, 0, 28, 0.9],
    [-36, 0, 24, 0.85],
    [-35, 0, 12, 0.8],
    [-35, 0, -8, 0.75],
    [-24.5, 0, -10, 0.82],
    [-39, 0, -28, 0.88],
    [-34, 0, -24, 0.82],
    [-10, 0, -28, 0.85],
    [-5, 0, -10, 0.8],
    [-5, 0, 31, 0.8],
    [-10, 0, 26, 0.85],

    // Central park & mosque courtyard
    [-2, 0, 25, 0.85],
    [1, 0, -4, 0.8],
    [-3, 0, -7, 0.85],
    [-4, 0, -16, 0.88],
    [2, 0, -28, 0.85],

    // Kampus 2 sector (Siti Walidah, Library, Lake, Masjid Sudalmiyah)
    [13.5, 0, 28, 0.85],
    [1, 0, 27, 0.8],
    [32, 0, 36, 0.85],
    [29, 0, 29, 0.85],
    [40, 0, 27, 0.88],
    [36, 0, 14, 0.8],
    [35, 0, -10, 0.82],
    [34, 0, -2, 0.85],
    [41, 0, -12, 0.9],

    // Edutorium & north sector
    [-7, 0, -40, 0.92],
    [14, 0, -28, 0.82],
    [13.5, 0, -32, 0.85],
    [34, 0, -20, 0.85],
    [38, 0, -34, 0.86],

    // Outer perimeter garden accent trees
    [-42, 0, 18, 0.9],
    [-30, 0, 36, 0.85],
    [-12, 0, 42, 0.8],
    [-26, 0, 42, 0.85],
    [8, 0, 38, 0.85],
    [26, 0, 38, 0.8],
    [-18, 0, -36, 0.85],
    [-12, 0, -35, 0.85],
  ];
  return (
    <group>
      {trees.map(([x, y, z, scale], index) => (
        <group key={`${x}-${z}-${index}`} position={[x, worldSurfaceY(x, z) + y, z]} rotation={worldSurfaceTilt(x, z)}>
          <Tree position={[0, 0, 0]} scale={scale} />
        </group>
      ))}
    </group>
  );
}
