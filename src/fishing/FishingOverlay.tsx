import { useEffect, useRef, useState } from 'react';
import { useExperience } from '../store/useExperience';
import { FISH, indicatorAt, reelProgress, type FishDefinition } from './game';
import { useFishing } from './useFishing';
import { useSports } from '../sports/useSports';

function FishPicture({ fish }: { fish: FishDefinition }) {
  return <svg viewBox="0 0 180 90" className="fish-picture" role="img" aria-label={`Ilustrasi ${fish.name}`}>
    <path d="M122 45 168 13 168 77Z" fill={fish.color} />
    <path d="M59 24 78 6 101 24M59 66 80 84 101 66" fill={fish.color} opacity=".7" />
    <ellipse cx="77" cy="45" rx={fish.id === 'lele' ? 62 : 55} ry={fish.id === 'gurame' ? 32 : 25} fill={fish.color} />
    <circle cx="42" cy="38" r="5" fill="#142c3d" />
    <path d="M69 32Q83 45 69 59" fill="none" stroke="#142c3d" strokeWidth="3" opacity=".4" />
    {fish.id === 'lele' && <path d="M24 47 3 32M24 49 3 66" stroke={fish.color} strokeWidth="3" />}
  </svg>;
}

export function FishingOverlay() {
  const fishing = useFishing();
  const { session, nearby, collection, storageFailed } = fishing;
  const phase = session.phase;
  const active = phase !== 'idle';
  const sportsBusy = useSports(s => s.nearby !== null || s.session.phase !== 'idle');
  const experience = useExperience();
  const blocked = !!(experience.activeLocationId || experience.mapOpen || experience.helpOpen || experience.completionOpen);
  const [album, setAlbum] = useState(false);
  const meter = useRef<HTMLDivElement>(null);
  const reelBar = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const mainButton = useRef<HTMLButtonElement>(null);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (blocked || !experience.started) useFishing.getState().close();
  }, [blocked, experience.started]);
  useEffect(() => {
    if (!active) { setAlbum(false); return; }
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    useExperience.getState().setMoveInput({ x: 0, z: 0 });
    const interrupt = () => { useFishing.getState().ready(); setAlbum(false); };
    const visibility = () => { if (document.hidden) interrupt(); };
    const keydown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') { event.preventDefault(); useFishing.getState().close(); }
      if (event.code === 'Space' && useFishing.getState().session.phase === 'timing') {
        event.preventDefault();
        if (!event.repeat) useFishing.getState().pull();
      }
    };
    window.addEventListener('blur', interrupt);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('keydown', keydown);
    let frame: number;
    const update = () => {
      const now = performance.now();
      useFishing.getState().tick(now);
      const current = useFishing.getState().session;
      if (meter.current && current.phase === 'timing') meter.current.style.left = `${indicatorAt(now - current.biteAt!) * 100}%`;
      if (reelBar.current && current.phase === 'reeling') reelBar.current.style.width = `${reelProgress(now - current.reelStartedAt!) * 100}%`;
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('blur', interrupt);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('keydown', keydown);
      useExperience.getState().setMoveInput({ x: 0, z: 0 });
      if (previous?.isConnected) previous.focus();
    };
  }, [active]);
  useEffect(() => {
    if (phase === 'timing') mainButton.current?.focus();
    if (!useExperience.getState().soundEnabled || (phase !== 'timing' && phase !== 'result')) return;
    const context = audio.current;
    if (!context || context.state !== 'running') return;
    const tone = context.createOscillator();
    const gain = context.createGain();
    tone.frequency.value = phase === 'timing' ? 660 : session.result?.caught ? 880 : 240;
    gain.gain.setValueAtTime(.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .25);
    tone.connect(gain); gain.connect(context.destination); tone.start(); tone.stop(context.currentTime + .25);
    tone.onended = () => { tone.disconnect(); gain.disconnect(); };
  }, [phase, session.result]);
  useEffect(() => () => { void audio.current?.close(); }, []);

  if (blocked || !experience.started) return null;
  if (!active) return nearby && !sportsBusy ? <div className="nearby-prompt fishing-prompt"><span>🎣 Kantin tepi danau</span><button onClick={fishing.start}>Mancing <kbd>E</kbd></button></div> : null;
  const fish = FISH.find(f => f.id === session.fishId);
  const title = album ? 'Koleksi ikan' : phase === 'ready' ? 'Santai sejenak, yuk.' : phase === 'waiting' ? 'Menunggu sambaran…' : phase === 'timing' ? 'Ikan menyambar!' : phase === 'reeling' ? 'Tarik ikannya!' : session.result?.caught ? `${fish!.name} tertangkap!` : 'Ikannya lepas…';
  const cast = () => {
    if (useExperience.getState().soundEnabled) {
      try { audio.current ??= new AudioContext(); void audio.current.resume().catch(() => {}); } catch { /* Audio is optional. */ }
    }
    fishing.cast();
  };
  return <section ref={panel} tabIndex={-1} className="fishing-panel" role="region" aria-label="Mini game mancing">
    <button className="fishing-close" aria-label="Selesai mancing" onClick={fishing.close}>×</button>
    <p className="fishing-eyebrow">KANTIN TEPI DANAU · MANCING</p>
    <div aria-live="polite"><h2>{title}</h2></div>
    {album ? <>
      <p>{Object.keys(collection).length} / {FISH.length} jenis ditemukan · tersimpan di perangkat ini</p>
      <div className="fish-album">{FISH.map(f => <article key={f.id} className={collection[f.id] ? '' : 'undiscovered'}>
        <FishPicture fish={f} /><strong>{f.name}</strong><small>{f.rarity}</small>
        <span>{collection[f.id] ? `${collection[f.id].count} tangkapan · rekor ${collection[f.id].bestCm} cm` : 'Belum tertangkap'}</span>
      </article>)}</div>
      <button onClick={() => setAlbum(false)}>Kembali</button>
    </> : <>
      {phase === 'ready' && <><p>Lempar umpan, lalu tarik saat indikator masuk zona hijau. Tidak perlu terburu-buru.</p><button className="fishing-primary" onClick={cast}>Lempar umpan</button></>}
      {phase === 'waiting' && <p>Perhatikan pelampung. Nikmati suasana danau sebentar.</p>}
      {phase === 'timing' && <>
        <p>Tekan <strong>Tarik!</strong> atau <kbd>Space</kbd> saat garis berada di zona hijau.</p>
        <div className="fishing-meter" aria-label="Indikator timing, tarik saat berada dalam zona hijau">
          <div className="fishing-zone" style={{ left: `${(1 - fish!.zone) * 50}%`, width: `${fish!.zone * 100}%` }} />
          <div ref={meter} className="fishing-needle" />
        </div><button ref={mainButton} className="fishing-primary" onClick={() => fishing.pull()}>Tarik!</button>
      </>}
      {phase === 'reeling' && <>
        <p>Ikan sudah terkait. Tahan sebentar sampai ikan berhasil diangkat ke dermaga.</p>
        <div className="reel-progress" role="progressbar" aria-label="Proses menarik ikan" aria-valuemin={0} aria-valuemax={100}>
          <div ref={reelBar} />
        </div>
      </>}
      {phase === 'result' && <>
        {session.result?.caught ? <div className="fish-result"><FishPicture fish={fish!} /><p><strong>{session.result.cm} cm</strong> · {fish!.rarity}<br />{session.result.isNew ? '✨ Koleksi baru!' : session.result.record ? '✨ Rekor baru!' : 'Ditambahkan ke koleksi'}</p></div> : <p>Tidak apa-apa. Lempar lagi dan tunggu indikator memasuki zona hijau.</p>}
        <button className="fishing-primary" onClick={fishing.ready}>Mancing lagi</button>
      </>}
      <div className="fishing-actions">{(phase === 'ready' || phase === 'result') && <button onClick={() => setAlbum(true)}>Koleksi ({Object.keys(collection).length}/5)</button>}<button onClick={fishing.close}>Selesai</button></div>
    </>}
    {storageFailed && <p role="status">Penyimpanan perangkat tidak tersedia. Koleksi hanya tersimpan selama sesi ini.</p>}
  </section>;
}
