import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { BASKET_DISTANCE, BASKET_OFFSETS, keeperAt, type Lane, type SportKind } from './game';
import { courtOrigin, courtRotation } from './geometry';
import { useSports } from './useSports';

const laneX = (lane: Lane) => lane === 'left' ? -1.25 : lane === 'right' ? 1.25 : 0;

function ActiveCourt({ kind }: { kind: SportKind }) {
  const ball = useRef<THREE.Mesh>(null);
  const keeper = useRef<THREE.Group>(null);
  const net = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const active = useSports(s => s.session.kind === kind && s.session.phase !== 'idle');
  useFrame(() => {
    const session = useSports.getState().session;
    if (!ball.current || !group.current || session.kind !== kind || session.phase === 'idle') return;
    const attempt = session.attempt;
    const startX = kind === 'basket' ? BASKET_OFFSETS[attempt] ?? 0 : 0;
    const startZ = kind === 'basket' ? BASKET_DISTANCE[attempt] ?? 1.9 : 1.8;
    let x: number = startX, y = kind === 'basket' ? 1.35 : .28, z = startZ - .65;
    if (session.phase === 'shooting' && session.outcome) {
      const duration = kind === 'basket' ? 1200 : 900;
      const t = THREE.MathUtils.clamp((performance.now() - session.shotStartedAt) / duration, 0, 1);
      const outcome = session.outcome;
      const targetX = kind === 'basket' ? (outcome.scored ? 0 : (startX < 0 ? -1.2 : 1.2)) : outcome.message.includes('melebar') ? laneX(outcome.lane) * 2.1 : laneX(outcome.lane);
      const targetZ = kind === 'basket' ? -4.37 : -5.22;
      x = THREE.MathUtils.lerp(startX, targetX, t);
      z = THREE.MathUtils.lerp(startZ - .65, targetZ, t);
      y = kind === 'basket' ? THREE.MathUtils.lerp(1.35, outcome.scored ? 2.14 : outcome.power < .5 ? 1.4 : 2.9, t) + Math.sin(t * Math.PI) * 1.45 : .25 + Math.sin(t * Math.PI) * .55;
      if (kind === 'soccer' && !outcome.scored && !outcome.message.includes('melebar') && t > .78) {
        z = THREE.MathUtils.lerp(z, -4.25, (t - .78) / .22);
        y += (t - .78) * 1.4;
      }
    } else if (session.phase === 'feedback' || session.phase === 'summary') {
      ball.current.visible = false;
    }
    if (session.phase !== 'feedback' && session.phase !== 'summary') ball.current.visible = true;
    ball.current.position.set(x, y, z);
    ball.current.rotation.x += .025;
    if (keeper.current) {
      const lane = session.phase === 'shooting' || session.phase === 'feedback' ? session.outcome?.keeper ?? 'center' : keeperAt(performance.now());
      keeper.current.position.x = THREE.MathUtils.lerp(keeper.current.position.x, laneX(lane), .12);
      keeper.current.rotation.z = session.phase === 'shooting' && session.outcome && !session.outcome.scored ? Math.sin(performance.now() * .02) * .16 : 0;
    }
    if (net.current) net.current.scale.z = session.phase === 'feedback' && session.outcome?.scored ? 1.08 : 1;
  });
  if (!active) return null;
  const origin = courtOrigin(kind);
  return <group ref={group} position={origin} quaternion={courtRotation(kind)}>
    <mesh ref={ball} castShadow>
      <sphereGeometry args={[kind === 'basket' ? .23 : .2, 14, 10]} />
      <meshStandardMaterial color={kind === 'basket' ? '#e47c32' : '#f3f4ef'} flatShading />
    </mesh>
    {kind === 'soccer' && <>
      <group ref={keeper} position={[0, 0, -4.95]}>
        <mesh position={[0, 1.03, 0]} castShadow><capsuleGeometry args={[.19, .6, 4, 8]} /><meshStandardMaterial color="#f3c84b" flatShading /></mesh>
        <mesh position={[0, 1.63, 0]} castShadow><sphereGeometry args={[.18, 8, 6]} /><meshStandardMaterial color="#c7875d" flatShading /></mesh>
        {[-.16,.16].map(x => <mesh key={x} position={[x,.4,0]}><boxGeometry args={[.12,.66,.16]} /><meshStandardMaterial color="#243957" /></mesh>)}
        {[-.29,.29].map(x => <mesh key={x} position={[x,1.22,0]} rotation={[0,0,x]}><boxGeometry args={[.12,.55,.14]} /><meshStandardMaterial color="#f3c84b" /></mesh>)}
      </group>
      <group ref={net} position={[0, .8, -5.35]}>
        <mesh><planeGeometry args={[2.4, 1.4, 8, 5]} /><meshBasicMaterial color="#ffffff" wireframe transparent opacity={.4} side={THREE.DoubleSide} /></mesh>
      </group>
    </>}
  </group>;
}

export function SportsScene() { return <><ActiveCourt kind="basket" /><ActiveCourt kind="soccer" /></>; }
