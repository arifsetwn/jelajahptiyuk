// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFishing } from '../fishing/useFishing';
import { useExperience } from '../store/useExperience';
import { STORAGE_KEY, emptyRecords, emptySession, keeperAt, medalFor, meterAt, readRecords, resolveShot } from './game';
import { useSports } from './useSports';

beforeEach(() => {
  localStorage.clear();
  useFishing.getState().close();
  useSports.setState({ nearby: 'basket', session: emptySession(), records: emptyRecords(), storageFailed: false });
  useExperience.setState({ mapOpen: false, helpOpen: false, activeLocationId: null });
});
afterEach(() => vi.restoreAllMocks());

function completeBasket() {
  const sports = useSports.getState();
  sports.start('basket');
  for (let i = 0; i < 5; i++) {
    useSports.getState().beginShot(i * 4000);
    useSports.getState().shoot(i * 4000 + 750);
    useSports.getState().shoot(i * 4000 + 750);
    useSports.getState().tick(i * 4000 + 1949);
    expect(useSports.getState().session.phase).toBe('shooting');
    useSports.getState().tick(i * 4000 + 1950);
    useSports.getState().tick(i * 4000 + 1951);
    expect(useSports.getState().session.history).toHaveLength(i + 1);
    useSports.getState().next();
  }
}

describe('sports rules', () => {
  it('runs the meter across the track in 1.5 seconds and back', () => {
    expect([0, 750, 1500, 2250, 3000].map(meterAt)).toEqual([0, .5, 1, .5, 0]);
    expect(resolveShot('basket', .5, 'center', 'center').scored).toBe(true);
    expect(resolveShot('basket', .2, 'center', 'center').message).toContain('pendek');
    expect(resolveShot('basket', .8, 'center', 'center').message).toContain('jauh');
    expect(resolveShot('soccer', .5, 'left', 'left').scored).toBe(false);
    expect(resolveShot('soccer', .5, 'left', 'right').scored).toBe(true);
    expect(resolveShot('soccer', .1, 'left', 'right').scored).toBe(false);
    expect([0, 850, 1700, 2550].map(keeperAt)).toEqual(['left', 'center', 'right', 'center']);
    expect(medalFor('basket', 10)).toBe('gold'); expect(medalFor('soccer', 3)).toBe('silver');
  });
  it('records only complete sessions, ignores repeated shots, and restores records', () => {
    completeBasket();
    expect(useSports.getState().session).toMatchObject({ phase: 'summary', score: 10 });
    expect(useSports.getState().records.basket).toMatchObject({ best: 10, medal: 'gold', sessions: 1 });
    expect(readRecords(localStorage).basket.best).toBe(10);
    useSports.getState().next();
    expect(useSports.getState().records.basket.sessions).toBe(1);
  });
  it('cancels an unfinished attempt on interruption, and restores controls on exit', () => {
    useSports.getState().start('basket');
    useSports.getState().beginShot(0);
    useSports.getState().interrupt();
    expect(useSports.getState().session.phase).toBe('ready');
    expect(useSports.getState().session.attempt).toBe(0);
    useSports.getState().close();
    expect(useSports.getState().session.phase).toBe('idle');
    expect(useSports.getState().records.basket.sessions).toBe(0);
  });
  it('locks soccer direction during timing and saves only once after animation', () => {
    useSports.setState({ nearby: 'soccer' });
    useSports.getState().start('soccer');
    useSports.getState().chooseLane('right');
    useSports.getState().beginShot(0);
    useSports.getState().chooseLane('left');
    useSports.getState().shoot(750);
    expect(useSports.getState().session.lane).toBe('right');
    expect(useSports.getState().session.history).toHaveLength(0);
    useSports.getState().tick(1650);
    useSports.getState().tick(2000);
    expect(useSports.getState().session.history).toHaveLength(1);
  });
  it('blocks fishing and location interactions, while opening the map closes sports', () => {
    useSports.getState().start('basket');
    useExperience.getState().openLocation('L08');
    expect(useExperience.getState().activeLocationId).toBeNull();
    useExperience.getState().setMapOpen(true);
    expect(useSports.getState().session.phase).toBe('idle');
    useFishing.setState({ nearby: true }); useFishing.getState().start();
    useSports.getState().start('basket');
    expect(useSports.getState().session.phase).toBe('idle');
  });
  it('resets corrupt sports data without touching visits and keeps records if writes fail', () => {
    localStorage.setItem('jelajah-pti-ums-progress-v2', 'keep');
    localStorage.setItem(STORAGE_KEY, '{invalid');
    expect(readRecords(localStorage)).toEqual(emptyRecords());
    expect(localStorage.getItem('jelajah-pti-ums-progress-v2')).toBe('keep');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    completeBasket();
    expect(useSports.getState().storageFailed).toBe(true);
    expect(useSports.getState().records.basket.best).toBe(10);
  });
});
