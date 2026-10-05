import { create } from 'zustand';
import { COLLECTION_KEY, FISH, REEL_DURATION, chooseFish, inZone, readCollection, type FishingCollection, type FishingSession } from './game';
interface FishingState {
  session: FishingSession; collection: FishingCollection; storageFailed: boolean; nearby: boolean;
  setNearby: (nearby: boolean) => void; start: () => void; close: () => void; ready: () => void;
  cast: (now?: number) => void; tick: (now?: number) => void; pull: (now?: number) => void;
}
export const useFishing = create<FishingState>((set, get) => ({
  session: { phase: 'idle' }, ...readCollection(), nearby: false,
  setNearby: nearby => { if (get().nearby !== nearby) set({ nearby }); },
  start: () => { if (get().nearby && get().session.phase === 'idle') set({ session: { phase: 'ready' } }); },
  close: () => set({ session: { phase: 'idle' } }),
  ready: () => { if (get().session.phase !== 'idle') set({ session: { phase: 'ready' } }); },
  cast: (now = performance.now()) => {
    if (get().session.phase !== 'ready') return;
    set({ session: { phase: 'waiting', fishId: chooseFish(Math.random()).id, biteAt: now + 3000 + Math.random() * 4000 } });
  },
  tick: (now = performance.now()) => {
    const s = get().session;
    if (s.phase === 'reeling' && s.reelStartedAt !== undefined && now >= s.reelStartedAt + REEL_DURATION) {
      const fish = FISH.find(item => item.id === s.fishId);
      const cm = s.result?.cm;
      if (!fish || cm === undefined) { set({ session: { phase: 'ready' } }); return; }
      const old = get().collection[fish.id];
      const collection = { ...get().collection, [fish.id]: { count: (old?.count ?? 0) + 1, bestCm: Math.max(old?.bestCm ?? 0, cm) } };
      let storageFailed = get().storageFailed;
      try { localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection)); storageFailed = false; } catch { storageFailed = true; }
      set({
        collection,
        storageFailed,
        session: { ...s, phase: 'result', result: { caught: true, cm, isNew: !old, record: !!old && cm > old.bestCm } },
      });
      return;
    }
    if ((s.phase !== 'waiting' && s.phase !== 'timing') || s.biteAt === undefined) return;
    if (now >= s.biteAt + 5000) set({ session: { ...s, phase: 'result', result: { caught: false } } });
    else if (now >= s.biteAt && s.phase === 'waiting') set({ session: { ...s, phase: 'timing' } });
  },
  pull: (now = performance.now()) => {
    get().tick(now);
    const s = get().session;
    if (s.phase !== 'timing' || s.biteAt === undefined) return;
    const fish = FISH.find(f => f.id === s.fishId)!;
    if (!inZone(now - s.biteAt, fish.zone)) {
      set({ session: { ...s, phase: 'result', result: { caught: false } } }); return;
    }
    const cm = 15 + Math.floor(Math.random() * 31);
    set({ session: { ...s, phase: 'reeling', reelStartedAt: now, result: { caught: true, cm } } });
  },
}));
