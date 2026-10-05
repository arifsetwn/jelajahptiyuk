import { useRef } from 'react';
import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LAKE_ORIGIN, LAKE_ROTATION } from './geometry';
import { FISH, reelProgress } from './game';
import { useFishing } from './useFishing';

const rodTip = new THREE.Vector3(-.3, 3.1, 5.8);
const fishStart = new THREE.Vector3(0, .08, 4.8);
const fishEnd = new THREE.Vector3(-.55, 1.8, 7.1);
const fishPosition = new THREE.Vector3();
const lineDirection = new THREE.Vector3();
const lineMiddle = new THREE.Vector3();
const upAxis = new THREE.Vector3(0, 1, 0);

function CaughtFish({ color, isCatfish }: { color: string; isCatfish: boolean }) {
  return <group scale={.66} rotation={[0, Math.PI / 2, 0]}>
    <mesh scale={[1.35, .68, .55]} castShadow><icosahedronGeometry args={[.48, 1]} /><meshStandardMaterial color={color} flatShading /></mesh>
    <mesh position={[-.72, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow><coneGeometry args={[.4, .62, 4]} /><meshStandardMaterial color={color} flatShading /></mesh>
    <mesh position={[.42, .12, .23]}><sphereGeometry args={[.045, 7, 5]} /><meshStandardMaterial color="#17283d" /></mesh>
    <mesh position={[0, .38, 0]} rotation={[0, 0, -.15]} castShadow><coneGeometry args={[.22, .48, 4]} /><meshStandardMaterial color={color} flatShading /></mesh>
    {isCatfish && <>
      <mesh position={[.52, -.05, .18]} rotation={[0, 0, .55]}><cylinderGeometry args={[.012, .012, .7, 5]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[.52, -.05, -.18]} rotation={[0, 0, .55]}><cylinderGeometry args={[.012, .012, .7, 5]} /><meshStandardMaterial color={color} /></mesh>
    </>}
  </group>;
}
export function FishingSpot() {
  const phase = useFishing(s => s.session.phase);
  const fishId = useFishing(s => s.session.fishId);
  const reelStartedAt = useFishing(s => s.session.reelStartedAt);
  const bobber = useRef<THREE.Group>(null);
  const caughtFish = useRef<THREE.Group>(null);
  const fishingLine = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (bobber.current) bobber.current.position.y = .15 + Math.sin(clock.elapsedTime * (phase === 'timing' ? 18 : 3)) * (phase === 'timing' ? .12 : .025);
    if (phase === 'reeling' && reelStartedAt !== undefined && caughtFish.current && fishingLine.current) {
      const progress = reelProgress(performance.now() - reelStartedAt);
      fishPosition.lerpVectors(fishStart, fishEnd, progress);
      fishPosition.y += Math.sin(progress * Math.PI) * 2.1;
      caughtFish.current.position.copy(fishPosition);
      caughtFish.current.rotation.z = Math.sin(progress * Math.PI * 7) * .28;
      caughtFish.current.rotation.y = progress * Math.PI * 3;

      lineDirection.subVectors(fishPosition, rodTip);
      lineMiddle.addVectors(rodTip, fishPosition).multiplyScalar(.5);
      fishingLine.current.position.copy(lineMiddle);
      fishingLine.current.scale.set(1, lineDirection.length(), 1);
      fishingLine.current.quaternion.setFromUnitVectors(upAxis, lineDirection.normalize());
    }
  });
  const fish = FISH.find(item => item.id === fishId);
  return <group position={LAKE_ORIGIN} quaternion={LAKE_ROTATION}>
    {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[0, .2, 6.3 + i * .22]} receiveShadow castShadow><boxGeometry args={[2.4, .2, .2]} /><meshStandardMaterial color={i % 2 ? '#b88751' : '#c99965'} /></mesh>)}
    {[-1, 1].flatMap(x => [6.4, 8.5].map(z => <mesh key={`${x}-${z}`} position={[x, -.15, z]} castShadow><cylinderGeometry args={[.08, .1, 1.3, 6]} /><meshStandardMaterial color="#765038" /></mesh>))}
    <mesh position={[-1.6, .6, 8.1]} castShadow><boxGeometry args={[.65, .15, 1.8]} /><meshStandardMaterial color="#a97843" /></mesh>
    {[7.5, 8.7].map(z => <mesh key={z} position={[-1.6, .25, z]}><boxGeometry args={[.5, .6, .12]} /><meshStandardMaterial color="#375c56" /></mesh>)}
    <mesh position={[.8, .55, 8]} castShadow><cylinderGeometry args={[.27, .2, .5, 10]} /><meshStandardMaterial color="#4c98ab" /></mesh>
    <mesh position={[-1.1, 1.1, 8.8]}><cylinderGeometry args={[.045, .045, 2, 6]} /><meshStandardMaterial color="#765038" /></mesh>
    {phase === 'idle' && <Html position={[-1.1, 2.3, 8.8]} center distanceFactor={14} style={{ pointerEvents: 'none' }}><div className="world-label">🎣 Spot mancing</div></Html>}
    {phase !== 'idle' && <>
      <Line points={[[-.48, 1.48, 7.0], [-.3, 3.1, 5.8]]} color="#64472f" lineWidth={4} />
      {(phase === 'waiting' || phase === 'timing') && <>
        <Line points={[[-.3, 3.1, 5.8], [0, .18, 4.8]]} color="#e9eee1" lineWidth={1} />
        <group ref={bobber} position={[0, .15, 4.8]}>
          <mesh><sphereGeometry args={[.12, 8, 6]} /><meshStandardMaterial color="#e96848" /></mesh>
          <mesh position={[0, -.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[phase === 'timing' ? .35 : .22, phase === 'timing' ? .4 : .25, 24]} /><meshBasicMaterial color="#e1f4ee" transparent opacity={.7} /></mesh>
        </group>
      </>}
      {phase === 'reeling' && fish && <>
        <mesh ref={fishingLine}>
          <cylinderGeometry args={[.008, .008, 1, 5]} />
          <meshBasicMaterial color="#eef5ec" />
        </mesh>
        <group ref={caughtFish} position={fishStart}>
          <CaughtFish color={fish.color} isCatfish={fish.id === 'lele'} />
        </group>
      </>}
    </>}
  </group>;
}
