// @vitest-environment jsdom
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { COLLECTION_KEY, FISH, REEL_DURATION, chooseFish, indicatorAt, inZone, readCollection, reelProgress } from './game';
import { useFishing } from './useFishing';
import { useExperience } from '../store/useExperience';
beforeEach(() => {
  localStorage.clear();
  useFishing.setState({ session: { phase: 'idle' }, nearby: true, collection: {}, storageFailed: false });
});
afterEach(() => vi.restoreAllMocks());
function cast() {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  useFishing.getState().start(); useFishing.getState().cast(0);
}
describe('fishing session', () => {
  it('requires proximity and cannot cast twice', () => {
    useFishing.setState({ nearby: false }); useFishing.getState().start();
    expect(useFishing.getState().session.phase).toBe('idle');
    useFishing.setState({ nearby: true }); cast();
    useFishing.getState().cast(100);
    expect(useFishing.getState().session.biteAt).toBe(3000);
  });
  it('catches once on the green zone and restores collection after reload', () => {
    cast(); useFishing.getState().pull(3750); useFishing.getState().pull(3750);
    expect(useFishing.getState().session.phase).toBe('reeling');
    expect(useFishing.getState().collection).toEqual({});
    useFishing.getState().tick(3750 + REEL_DURATION);
    expect(useFishing.getState().session.result).toMatchObject({ caught: true, isNew: true, cm: 15 });
    expect(readCollection().collection.nila).toEqual({ count: 1, bestCm: 15 });
  });
  it('records a larger fish without losing count', () => {
    cast(); useFishing.getState().pull(3750); useFishing.getState().tick(3750 + REEL_DURATION);
    useFishing.getState().ready(); useFishing.getState().cast(5000);
    vi.mocked(Math.random).mockReturnValue(.999);
    useFishing.getState().pull(8750); useFishing.getState().tick(8750 + REEL_DURATION);
    expect(useFishing.getState().session.result?.record).toBe(true);
    expect(useFishing.getState().collection.nila).toEqual({ count: 2, bestCm: 45 });
  });
  it('fails outside the zone and at the exact deadline', () => {
    cast(); useFishing.getState().pull(3100);
    expect(useFishing.getState().session.result?.caught).toBe(false);
    useFishing.getState().ready(); useFishing.getState().cast(0); useFishing.getState().pull(8000);
    expect(useFishing.getState().session.result?.caught).toBe(false);
    expect(useFishing.getState().collection).toEqual({});
  });
  it('ignores early pulls, cancels on blur reset, and cannot catch after exit', () => {
    cast(); useFishing.getState().pull(2000);
    expect(useFishing.getState().session.phase).toBe('waiting');
    useFishing.getState().ready(); useFishing.getState().tick(9000);
    expect(useFishing.getState().session.phase).toBe('ready');
    useFishing.getState().close(); useFishing.getState().pull(3750);
    expect(useFishing.getState().collection).toEqual({});
  });
  it('opening map or help exits fishing, and location interaction is blocked', () => {
    cast(); useExperience.setState({ activeLocationId: null });
    useExperience.getState().openLocation('L08');
    expect(useExperience.getState().activeLocationId).toBeNull();
    useExperience.getState().setMapOpen(true);
    expect(useFishing.getState().session.phase).toBe('idle');
    cast(); useExperience.getState().setHelpOpen(true);
    expect(useFishing.getState().session.phase).toBe('idle');
  });
});
describe('fish distribution and timing', () => {
  it('uses the requested weights and green zones', () => {
    expect([0, .3499, .35, .6499, .65, .8499, .85, .9499, .95, .999].map(n => chooseFish(n).id)).toEqual(['nila','nila','mujair','mujair','lele','lele','patin','patin','gurame','gurame']);
    expect(FISH.map(f => f.zone)).toEqual([.35,.35,.28,.22,.22]);
  });
  it('travels in 1.5 seconds and returns, with inclusive zone edges', () => {
    expect([0,750,1500,2250,3000].map(indicatorAt)).toEqual([0,.5,1,.5,0]);
    expect(inZone(750, .22)).toBe(true); expect(inZone(0, .35)).toBe(false);
    expect([0, REEL_DURATION / 2, REEL_DURATION, REEL_DURATION * 2].map(reelProgress)).toEqual([0, .5, 1, 1]);
  });
});
describe('storage resilience', () => {
  it('resets corrupt data without touching visit progress', () => {
    localStorage.setItem('jelajah-pti-ums-progress-v2', 'keep');
    localStorage.setItem(COLLECTION_KEY, '{invalid');
    expect(readCollection().collection).toEqual({});
    expect(localStorage.getItem('jelajah-pti-ums-progress-v2')).toBe('keep');
    localStorage.setItem(COLLECTION_KEY, JSON.stringify({ nila: { count: -1, bestCm: 90 } }));
    expect(readCollection().collection).toEqual({});
  });
  it('keeps catches in memory when writes fail', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    cast(); useFishing.getState().pull(3750); useFishing.getState().tick(3750 + REEL_DURATION);
    expect(useFishing.getState().storageFailed).toBe(true);
    expect(useFishing.getState().collection.nila.count).toBe(1);
  });
});
