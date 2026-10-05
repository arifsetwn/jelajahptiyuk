export type SportKind = 'basket' | 'soccer';
export type Lane = 'left' | 'center' | 'right';
export type Phase = 'idle' | 'ready' | 'aiming' | 'timing' | 'shooting' | 'feedback' | 'summary';
export type Medal = 'none' | 'bronze' | 'silver' | 'gold';
export interface ShotOutcome { scored: boolean; message: string; lane: Lane; keeper: Lane; power: number }
export interface SportsSession {
  phase: Phase; kind: SportKind | null; attempt: number; score: number; lane: Lane;
  meterStartedAt: number; shotStartedAt: number; outcome: ShotOutcome | null;
  history: ShotOutcome[];
}
export interface SportRecord { best: number; medal: Medal; sessions: number }
export type SportsRecords = Record<SportKind, SportRecord>;
export const STORAGE_KEY = 'jelajah-pti-sports-v1';
export const MAX_SHOTS = 5;
export const BASKET_OFFSETS = [0, -1.35, 1.35, 0, 0] as const;
export const BASKET_DISTANCE = [1.9, 2.35, 2.35, 3.5, 1.9] as const;
export const emptySession = (): SportsSession => ({ phase: 'idle', kind: null, attempt: 0, score: 0, lane: 'center', meterStartedAt: 0, shotStartedAt: 0, outcome: null, history: [] });
export const emptyRecords = (): SportsRecords => ({ basket: { best: 0, medal: 'none', sessions: 0 }, soccer: { best: 0, medal: 'none', sessions: 0 } });

// A complete trip across the meter takes 1.5 seconds.
export function meterAt(elapsedMs: number): number {
  const cycle = ((elapsedMs % 3000) + 3000) % 3000;
  return cycle <= 1500 ? cycle / 1500 : (3000 - cycle) / 1500;
}
export function keeperAt(timeMs: number): Lane {
  const cycle = Math.floor(timeMs / 850) % 4;
  return (['left', 'center', 'right', 'center'] as Lane[])[cycle];
}
export function medalFor(kind: SportKind, score: number): Medal {
  if (score === (kind === 'basket' ? 10 : 5)) return 'gold';
  if (score >= (kind === 'basket' ? 6 : 3)) return 'silver';
  if (score >= (kind === 'basket' ? 4 : 2)) return 'bronze';
  return 'none';
}
export function resolveShot(kind: SportKind, power: number, lane: Lane, keeper: Lane): ShotOutcome {
  const halfWidth = kind === 'basket' ? .15 : .175;
  if (Math.abs(power - .5) > halfWidth) return {
    scored: false, message: kind === 'basket' ? (power < .5 ? 'Lemparan terlalu pendek.' : 'Lemparan terlalu jauh.') : 'Tendangan melebar.', lane, keeper, power,
  };
  if (kind === 'soccer' && lane === keeper) return { scored: false, message: 'Kiper berhasil menepis bola!', lane, keeper, power };
  return { scored: true, message: kind === 'basket' ? 'Masuk! Dua poin.' : 'Gol! Satu poin.', lane, keeper, power };
}

export function readRecords(storage: Pick<Storage, 'getItem'> | null): SportsRecords {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return emptyRecords();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyRecords();
    const source = parsed as Record<string, unknown>;
    const result = emptyRecords();
    for (const kind of ['basket', 'soccer'] as const) {
      const value = source[kind] as Record<string, unknown> | undefined;
      if (!value || typeof value.best !== 'number' || !Number.isInteger(value.best) || value.best < 0 || value.best > (kind === 'basket' ? 10 : 5) || typeof value.sessions !== 'number' || !Number.isInteger(value.sessions) || value.sessions < 0) return emptyRecords();
      result[kind] = { best: value.best, sessions: value.sessions, medal: medalFor(kind, value.best) };
    }
    return result;
  } catch { return emptyRecords(); }
}
