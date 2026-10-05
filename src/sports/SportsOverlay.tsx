import { useEffect, useRef } from 'react';
import { useExperience } from '../store/useExperience';
import { MAX_SHOTS, keeperAt, medalFor, meterAt, type Lane, type SportKind } from './game';
import { useSports } from './useSports';

const title = (kind: SportKind) => kind === 'basket' ? 'Tantangan Basket' : 'Tantangan Mini Soccer';
const laneName: Record<Lane, string> = { left: 'Kiri', center: 'Tengah', right: 'Kanan' };
function playTone(success: boolean, context: AudioContext | null) {
  if (!context || context.state !== 'running' || !useExperience.getState().soundEnabled) return;
  const oscillator = context.createOscillator(); const gain = context.createGain();
  oscillator.frequency.value = success ? 800 : 280;
  gain.gain.setValueAtTime(.07, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .2);
  oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .2);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
}

export function SportsOverlay() {
  const { nearby, session, records, storageFailed } = useSports();
  const started = useExperience(s => s.started);
  const blocked = useExperience(s => Boolean(s.activeLocationId || s.mapOpen || s.helpOpen || s.completionOpen));
  const meter = useRef<HTMLDivElement>(null);
  const keeper = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const phase = session.phase;
  const active = phase !== 'idle';

  useEffect(() => { if (blocked || !started) useSports.getState().close(); }, [blocked, started]);
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus(); useExperience.getState().setMoveInput({ x: 0, z: 0 });
    const interrupt = () => useSports.getState().interrupt();
    const visibility = () => { if (document.hidden) interrupt(); };
    const keydown = (event: KeyboardEvent) => {
      const current = useSports.getState().session;
      if (event.code === 'Escape') { event.preventDefault(); useSports.getState().close(); }
      if (current.kind === 'soccer' && current.phase === 'aiming') {
        const lane = ({ ArrowLeft: 'left', ArrowDown: 'center', ArrowRight: 'right' } as Record<string, Lane>)[event.code];
        if (lane) { event.preventDefault(); useSports.getState().chooseLane(lane); }
      }
      if (event.code === 'Space' && current.phase === 'timing') { event.preventDefault(); if (!event.repeat) useSports.getState().shoot(); }
    };
    window.addEventListener('blur', interrupt); document.addEventListener('visibilitychange', visibility); window.addEventListener('keydown', keydown);
    let frame: number;
    const update = () => {
      const now = performance.now(); useSports.getState().tick(now);
      const current = useSports.getState().session;
      if (meter.current && current.phase === 'timing') meter.current.style.left = `${meterAt(now - current.meterStartedAt) * 100}%`;
      if (keeper.current && current.kind === 'soccer' && ['aiming', 'timing'].includes(current.phase)) keeper.current.textContent = laneName[keeperAt(now)];
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('blur', interrupt); document.removeEventListener('visibilitychange', visibility); window.removeEventListener('keydown', keydown); useExperience.getState().setMoveInput({ x: 0, z: 0 }); if (previous?.isConnected) previous.focus(); };
  }, [active]);
  useEffect(() => { if (phase === 'feedback' && session.outcome) playTone(session.outcome.scored, audio.current); }, [phase, session.outcome]);
  useEffect(() => () => { void audio.current?.close(); }, []);

  if (!started || blocked) return null;
  if (!active) return nearby ? <div className="nearby-prompt sports-prompt"><span>{nearby === 'basket' ? '🏀 Lapangan basket' : '⚽ Lapangan mini soccer'}</span><button type="button" onClick={() => useSports.getState().start(nearby)}>Main <kbd>E</kbd></button></div> : null;
  if (!session.kind) return null;
  const kind = session.kind;
  const record = records[kind];
  const scored = session.outcome?.scored ?? false;
  const begin = () => {
    if (useExperience.getState().soundEnabled) try { audio.current ??= new AudioContext(); void audio.current.resume().catch(() => {}); } catch { /* Optional audio. */ }
    useSports.getState().beginShot();
  };
  return <section ref={panel} tabIndex={-1} className="sports-panel" role="region" aria-label={title(kind)}>
    <button className="sports-close" type="button" aria-label="Selesai bermain" onClick={() => useSports.getState().close()}>×</button>
    <p className="sports-eyebrow">{kind === 'basket' ? 'LAPANGAN BASKET' : 'LAPANGAN MINI SOCCER'} · MINI GAME</p>
    <h2>{title(kind)}</h2>
    <div className="sports-stats"><span>Percobaan <strong>{Math.min(session.attempt + 1, MAX_SHOTS)}/{MAX_SHOTS}</strong></span><span>Skor <strong>{session.score}/{kind === 'basket' ? 10 : 5}</strong></span><span>Rekor <strong>{record.best}</strong></span></div>
    {phase === 'ready' && <><p>Tekan tombol, lalu hentikan indikator di zona hijau agar bola masuk ring.</p><button className="sports-primary" type="button" onClick={begin}>Siap lempar</button></>}
    {phase === 'aiming' && <><p>Pilih arah tendangan. Perhatikan posisi kiper, lalu siapkan timing.</p><div className="sports-lanes">{(['left','center','right'] as Lane[]).map(lane => <button key={lane} className={session.lane === lane ? 'selected' : ''} type="button" aria-pressed={session.lane === lane} onClick={() => useSports.getState().chooseLane(lane)}>{laneName[lane]}</button>)}</div><p className="sports-keeper">Kiper: <strong ref={keeper}>Tengah</strong></p><button className="sports-primary" type="button" onClick={begin}>Siap tendang</button></>}
    {phase === 'timing' && <><p>Tekan <strong>{kind === 'basket' ? 'Lempar!' : 'Tendang!'}</strong> atau <kbd>Space</kbd> saat garis berada di zona hijau.</p><div className="sports-meter" aria-label="Indikator timing"><div className="sports-zone" style={{ width: kind === 'basket' ? '30%' : '35%', left: kind === 'basket' ? '35%' : '32.5%' }} /><div ref={meter} className="sports-needle" /></div>{kind === 'soccer' && <p className="sports-keeper">Kiper: <strong ref={keeper}>Tengah</strong></p>}<button className="sports-primary" type="button" onClick={() => useSports.getState().shoot()}>{kind === 'basket' ? 'Lempar!' : 'Tendang!'}</button></>}
    {phase === 'shooting' && <p role="status">{kind === 'basket' ? 'Bola melayang ke ring…' : 'Bola meluncur ke gawang…'}</p>}
    {phase === 'feedback' && <><p role="status" className={scored ? 'sports-success' : ''}><strong>{session.outcome?.message}</strong></p><button className="sports-primary" type="button" onClick={() => useSports.getState().next()}>{session.attempt === MAX_SHOTS - 1 ? 'Lihat hasil' : 'Percobaan berikutnya'}</button></>}
    {phase === 'summary' && <><p className="sports-summary">{session.score} / {kind === 'basket' ? 10 : 5} poin · {medalFor(kind, session.score) === 'none' ? 'Terus berlatih!' : `Medali ${medalFor(kind, session.score)}`}</p><p>Rekor terbaik: {record.best} poin · {record.sessions} sesi selesai</p><div className="sports-actions"><button className="sports-primary" type="button" onClick={() => { useSports.getState().close(); useSports.getState().start(kind); }}>Main lagi</button><button type="button" onClick={() => useSports.getState().close()}>Selesai</button></div></>}
    {storageFailed && <p role="status" className="sports-storage">Penyimpanan tidak tersedia. Rekor hanya tersimpan selama sesi ini.</p>}
  </section>;
}
