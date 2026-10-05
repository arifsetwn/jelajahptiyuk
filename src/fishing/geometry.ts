import { Euler, Quaternion, Vector3 } from 'three';
import { worldSurfaceTilt, worldSurfaceY } from '../worldGeometry';
// Share the lake's existing transform: its water is a tilted planar disc.
export const LAKE_ORIGIN = new Vector3(28, worldSurfaceY(28, 20), 20);
export const LAKE_ROTATION = new Quaternion().setFromEuler(new Euler(...worldSurfaceTilt(28, 20)));
export const lakePoint = (x: number, y: number, z: number) => new Vector3(x, y, z).applyQuaternion(LAKE_ROTATION).add(LAKE_ORIGIN);
export const FISHING_STAND = lakePoint(0, .3, 7.7);
export const FISHING_FLOAT = lakePoint(0, .14, 4.8);
export const FISHING_ROTATION = LAKE_ROTATION.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.PI));

// Feet extend .694 units below the rigid-body origin in the current player model.
export const FISHING_BODY = FISHING_STAND.clone().add(new Vector3(0, .694, 0).applyQuaternion(FISHING_ROTATION));
