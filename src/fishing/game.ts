export interface FishDefinition {
  id: string; name: string; weight: number; zone: number; rarity: string; color: string;
}
export const FISH: FishDefinition[] = [
  { id: 'nila', name: 'Nila', weight: 35, zone: .35, rarity: 'Umum', color: '#65b9cd' },
  { id: 'mujair', name: 'Mujair', weight: 30, zone: .35, rarity: 'Umum', color: '#e2b671' },
  { id: 'lele', name: 'Lele', weight: 20, zone: .28, rarity: 'Unik', color: '#8895c8' },
  { id: 'patin', name: 'Patin', weight: 10, zone: .22, rarity: 'Langka', color: '#b3d4db' },
  { id: 'gurame', name: 'Gurame', weight: 5, zone: .22, rarity: 'Langka', color: '#eead64' },
];
export interface FishingCollection { [id: string]: { count: number; bestCm: number } }
export interface FishingSession {
  phase: 'idle' | 'ready' | 'waiting' | 'timing' | 'reeling' | 'result';
  fishId?: string;
  biteAt?: number;
  reelStartedAt?: number;
  result?: { caught: boolean; cm?: number; isNew?: boolean; record?: boolean };
}
export const COLLECTION_KEY = 'jelajah-pti-fishing-v1';
export const REEL_DURATION = 1800;
export function chooseFish(random: number) {
  let value = random * 100;
  return FISH.find(fish => (value -= fish.weight) < 0) ?? FISH[FISH.length - 1];
}
export function indicatorAt(elapsed: number) {
  const travel = Math.max(0, elapsed) / 1500 % 2;
  return travel <= 1 ? travel : 2 - travel;
}
export function inZone(elapsed: number, zone: number) {
  return Math.abs(indicatorAt(elapsed) - .5) <= zone / 2;
}
export function reelProgress(elapsed: number) {
  return Math.min(1, Math.max(0, elapsed / REEL_DURATION));
}
export function readCollection(): { collection: FishingCollection; storageFailed: boolean } {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY);
    if (!raw) return { collection: {}, storageFailed: false };
    const data = JSON.parse(raw);
    if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('Invalid collection');
    const collection: FishingCollection = {};
    for (const [id, entry] of Object.entries(data)) {
      const item = entry as { count: number; bestCm: number };
      if (!FISH.some(f => f.id === id) || !item || !Number.isSafeInteger(item.count) || item.count < 1 || !Number.isInteger(item.bestCm) || item.bestCm < 15 || item.bestCm > 45) throw new Error('Invalid fish');
      collection[id] = { count: item.count, bestCm: item.bestCm };
    }
    return { collection, storageFailed: false };
  } catch {
    try { localStorage.removeItem(COLLECTION_KEY); return { collection: {}, storageFailed: false }; }
    catch { return { collection: {}, storageFailed: true }; }
  }
}
