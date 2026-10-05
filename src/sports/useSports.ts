import { create } from 'zustand';
import { useFishing } from '../fishing/useFishing';
import { MAX_SHOTS, STORAGE_KEY, emptySession, emptyRecords, keeperAt, medalFor, meterAt, readRecords, resolveShot, type Lane, type SportKind, type SportsRecords, type SportsSession } from './game';

interface SportsState {
  nearby: SportKind | null; session: SportsSession; records: SportsRecords; storageFailed: boolean;
  setNearby: (kind: SportKind | null) => void; start: (kind: SportKind) => void; close: () => void;
  chooseLane: (lane: Lane) => void; beginShot: (now?: number) => void; shoot: (now?: number) => void;
  tick: (now?: number) => void; next: () => void; interrupt: () => void;
}
const getStorage = () => { try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; } };
const initialStorage = getStorage();
export const useSports = create<SportsState>((set, get) => ({
  nearby: null, session: emptySession(), records: initialStorage ? readRecords(initialStorage) : emptyRecords(), storageFailed: !initialStorage,
  setNearby: kind => { if (get().nearby !== kind) set({ nearby: kind }); },
  start: kind => {
    if (get().nearby !== kind || get().session.phase !== 'idle' || useFishing.getState().session.phase !== 'idle') return;
    set({ session: { ...emptySession(), kind, phase: kind === 'basket' ? 'ready' : 'aiming' } });
  },
  close: () => set({ session: emptySession() }),
  chooseLane: lane => set(s => s.session.phase === 'aiming' ? { session: { ...s.session, lane } } : s),
  beginShot: (now = performance.now()) => set(s => ['ready', 'aiming'].includes(s.session.phase) ? { session: { ...s.session, phase: 'timing', meterStartedAt: now } } : s),
  shoot: (now = performance.now()) => set(s => {
    const current = s.session;
    if (current.phase !== 'timing' || !current.kind) return s;
    const power = meterAt(now - current.meterStartedAt);
    const outcome = resolveShot(current.kind, power, current.lane, keeperAt(now));
    return { session: { ...current, phase: 'shooting', shotStartedAt: now, outcome } };
  }),
  tick: (now = performance.now()) => {
    const current = get().session;
    if (current.phase !== 'shooting' || !current.kind || !current.outcome || now - current.shotStartedAt < (current.kind === 'basket' ? 1200 : 900)) return;
    set({ session: { ...current, phase: 'feedback', score: current.score + (current.outcome.scored ? current.kind === 'basket' ? 2 : 1 : 0), history: [...current.history, current.outcome] } });
  },
  next: () => {
    const current = get().session;
    if (current.phase !== 'feedback' || !current.kind) return;
    if (current.attempt < MAX_SHOTS - 1) {
      set({ session: { ...current, phase: current.kind === 'basket' ? 'ready' : 'aiming', attempt: current.attempt + 1, lane: 'center', outcome: null } });
      return;
    }
    const prior = get().records[current.kind];
    const nextRecords = { ...get().records, [current.kind]: { best: Math.max(prior.best, current.score), medal: medalFor(current.kind, Math.max(prior.best, current.score)), sessions: prior.sessions + 1 } };
    set({ session: { ...current, phase: 'summary' }, records: nextRecords });
    try { const storage = getStorage(); if (!storage) throw new Error('storage unavailable'); storage.setItem(STORAGE_KEY, JSON.stringify(nextRecords)); }
    catch { set({ storageFailed: true }); }
  },
  interrupt: () => set(s => s.session.phase === 'aiming' || s.session.phase === 'timing' ? { session: { ...s.session, phase: s.session.kind === 'basket' ? 'ready' : 'aiming', outcome: null } } : s),
}));
