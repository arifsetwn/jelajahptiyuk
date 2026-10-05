import { Euler, Quaternion, Vector3 } from 'three';
import { worldSurfaceTilt, worldSurfaceY } from '../worldGeometry';
import { BASKET_DISTANCE, BASKET_OFFSETS, type SportKind } from './game';

export const courtOrigin = (kind: SportKind) => {
  const x = kind === 'basket' ? 12 : 3.8;
  return new Vector3(x, worldSurfaceY(x, -12) + .08, -12);
};
export const courtRotation = (kind: SportKind) => new Quaternion().setFromEuler(new Euler(...worldSurfaceTilt(kind === 'basket' ? 12 : 3.8, -12)));
export const courtPoint = (kind: SportKind, x: number, y: number, z: number) => new Vector3(x, y, z).applyQuaternion(courtRotation(kind)).add(courtOrigin(kind));
export const sportStand = (kind: SportKind, attempt: number) => kind === 'basket'
  ? courtPoint(kind, BASKET_OFFSETS[attempt] ?? 0, .25, BASKET_DISTANCE[attempt] ?? 1.9)
  : courtPoint(kind, 0, .25, 1.8);
export const sportBody = (kind: SportKind, attempt: number) => sportStand(kind, attempt).add(new Vector3(0, .694, 0).applyQuaternion(courtRotation(kind)));
export const sportRotation = (kind: SportKind) => courtRotation(kind).multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI));
export const sportPrompt = (kind: SportKind) => courtPoint(kind, 0, .1, 6);
