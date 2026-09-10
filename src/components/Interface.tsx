import {
  ArrowCounterClockwise,
  ArrowsOutLineVertical,
  ArrowSquareOut,
  Buildings,
  Camera,
  CheckCircle,
  Gauge,
  HandTap,
  Keyboard,
  MapPin,
  MapTrifold,
  Question,
  SpeakerHigh,
  SpeakerSlash,
  X,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { getLocation, locations } from "../data/locations";
import { useExperience } from "../store/useExperience";

function IconButton({ label, onClick, active = false, children }: { label: string; onClick: () => void; active?: boolean; children: ReactNode }) {
  return (
    <button className={`icon-button ${active ? "is-active" : ""}`} type="button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  );
}

function Dialog({ title, onClose, children, className = "" }: { title: string; onClose: () => void; children: ReactNode; className?: string }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className={`dialog ${className}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
        <button type="button" className="dialog-close" aria-label={`Tutup ${title}`} onClick={onClose}>
          <X size={22} weight="bold" />
        </button>
        {children}
      </div>
    </div>
  );
}

function LandingCharacter() {
  return (
    <div className="landing-character-stage" aria-hidden="true">
      <div className="landing-character-shadow" />
      <div className="landing-character">
        <div className="landing-character-head">
          <div className="landing-character-hair" />
          <div className="landing-character-cap"><span /></div>
          <div className="landing-character-glasses"><i /><b /><i /></div>
        </div>
        <div className="landing-character-body">
          <div className="landing-character-shirt" />
          <div className="landing-character-arm arm-left"><span /></div>
          <div className="landing-character-arm arm-right"><span /></div>
        </div>
        <div className="landing-character-legs">
          <div className="landing-character-leg"><span /></div>
          <div className="landing-character-leg"><span /></div>
        </div>
      </div>
      <div className="landing-character-greeting">Hai! Yuk jelajah kampus <span>↗</span></div>
    </div>
  );
}

function StartScreen() {
  const start = useExperience((state) => state.start);
  const ready = useExperience((state) => state.assetsLoaded);
  const statusText = ready ? "Kampus 3D siap!" : "Menyiapkan kampus 3D...";
  const ptiTotal = locations.filter((location) => location.category === "pti_fkip").length;
  const umsTotal = locations.filter((location) => location.category === "landmark_ums").length;

  return (
    <section className="start-screen" aria-labelledby="welcome-title">
      <div className="start-panel">
        <div className="brand-lockup">
          <span className="brand-mark"><Buildings size={28} weight="fill" /></span>
          <span>Jelajah PTI</span>
          <small>UMS</small>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Pendidikan Teknik Informatika</p>
          <h1 id="welcome-title">Yuk jalan-jalan kenali Pendidikan Teknik Informatika UMS</h1>
          <p>Jelajahi ruangan dan fasilitas UMS dalam miniatur kampus interaktif.</p>

          <div className="asset-load-card" role="region" aria-label="Informasi pemuatan aset">
            <div className="asset-load-header">
              <span className="asset-load-label">
                <span className={`asset-load-indicator ${ready ? "is-ready" : "is-loading"}`} />
                {statusText}
              </span>
              <strong className="asset-load-percent">{ready ? "Siap" : "Memuat"}</strong>
            </div>
            <div className="asset-load-track" role="progressbar" aria-label="Kesiapan kampus 3D" aria-valuenow={ready ? 100 : undefined} aria-valuemin={0} aria-valuemax={100} aria-valuetext={statusText}>
              <div className={`asset-load-fill ${ready ? "" : "is-loading"}`} style={{ width: ready ? "100%" : "35%" }} />
            </div>
          </div>

          <div className="hero-actions">
            <button
              className={`primary-button ${ready ? "is-ready" : "is-loading"}`}
              type="button"
              disabled={!ready}
              onClick={start}
            >
              {ready ? (
                <>
                  <span>Mulai jelajah</span>
                  <ArrowSquareOut size={20} weight="bold" />
                </>
              ) : (
                <span>Menyiapkan kampus...</span>
              )}
            </button>
          </div>
        </div>
        <div className="start-meta" aria-label="Ringkasan pengalaman">
          <span><strong>{locations.length}</strong> lokasi</span>
          <span><strong>{ptiTotal}</strong> ruang PTI</span>
          <span><strong>{umsTotal}</strong> ikon UMS</span>
        </div>
      </div>
      <LandingCharacter />
    </section>
  );
}

function BackgroundAudio() {
  const started = useExperience((state) => state.started);
  const soundEnabled = useExperience((state) => state.soundEnabled);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.32;

    if (started && soundEnabled) {
      void audio.play().catch(() => {
        // Browser dapat menolak audio sampai pengguna berinteraksi dengan halaman.
      });
    } else {
      audio.pause();
    }
  }, [started, soundEnabled]);

  return (
    <audio
      ref={audioRef}
      src={`${import.meta.env.BASE_URL}apple_cider.ogg`}
      loop
      preload="auto"
    />
  );
}

function Header() {
  const [cameraSettingsOpen, setCameraSettingsOpen] = useState(false);
  const soundEnabled = useExperience((state) => state.soundEnabled);
  const quality = useExperience((state) => state.quality);
  const cameraMode = useExperience((state) => state.cameraMode);
  const cameraHeight = useExperience((state) => state.cameraHeight);
  const mapOpen = useExperience((state) => state.mapOpen);
  const toggleSound = useExperience((state) => state.toggleSound);
  const toggleQuality = useExperience((state) => state.toggleQuality);
  const toggleCamera = useExperience((state) => state.toggleCamera);
  const setCameraHeight = useExperience((state) => state.setCameraHeight);
  const setMapOpen = useExperience((state) => state.setMapOpen);
  const setHelpOpen = useExperience((state) => state.setHelpOpen);

  return (
    <header className="app-header">
      <a className="compact-brand" href={import.meta.env.BASE_URL} aria-label="Jelajah PTI UMS, kembali ke awal">
        <Buildings size={22} weight="fill" />
        <span>jelajah<strong>PTI</strong></span>
      </a>
      <nav className="header-actions" aria-label="Kontrol pengalaman">
        <IconButton label={soundEnabled ? "Matikan suara" : "Aktifkan suara"} active={soundEnabled} onClick={toggleSound}>
          {soundEnabled ? <SpeakerHigh size={21} /> : <SpeakerSlash size={21} />}
        </IconButton>
        <IconButton label={`Kualitas ${quality === "detail" ? "detail" : "ringan"}`} active={quality === "detail"} onClick={toggleQuality}>
          <Gauge size={21} />
        </IconButton>
        <IconButton label={cameraMode === "follow" ? "Gunakan kamera overview" : "Ikuti karakter"} active={cameraMode === "overview"} onClick={toggleCamera}>
          <Camera size={21} />
        </IconButton>
        <div className="camera-height-control">
          <IconButton
            label="Atur ketinggian kamera"
            active={cameraSettingsOpen}
            onClick={() => setCameraSettingsOpen((open) => !open)}
          >
            <ArrowsOutLineVertical size={21} />
          </IconButton>
          {cameraSettingsOpen && (
            <div className="camera-height-panel">
              <div className="camera-height-heading">
                <span>Ketinggian kamera</span>
                <strong>{cameraHeight}</strong>
              </div>
              <input
                aria-label="Ketinggian kamera"
                type="range"
                min="12"
                max="30"
                step="1"
                value={cameraHeight}
                onChange={(event) => setCameraHeight(Number(event.target.value))}
              />
              <div className="camera-height-scale" aria-hidden="true">
                <span>Rendah</span><span>Normal</span><span>Tinggi</span>
              </div>
            </div>
          )}
        </div>
        <IconButton label="Buka peta" active={mapOpen} onClick={() => setMapOpen(true)}>
          <MapTrifold size={21} />
        </IconButton>
        <IconButton label="Buka bantuan" onClick={() => setHelpOpen(true)}>
          <Question size={21} weight="bold" />
        </IconButton>
      </nav>
    </header>
  );
}

function ProgressPanel() {
  const visited = useExperience((state) => state.visitedLocationIds);
  const ptiCount = locations.filter((location) => location.category === "pti_fkip" && visited.includes(location.id)).length;
  const umsCount = locations.filter((location) => location.category === "landmark_ums" && visited.includes(location.id)).length;
  const ptiTotal = locations.filter((location) => location.category === "pti_fkip").length;
  const umsTotal = locations.filter((location) => location.category === "landmark_ums").length;

  return (
    <aside className="progress-panel" aria-label="Progres jelajah">
      <div className="progress-number"><strong>{visited.length}</strong><span>dari {locations.length} lokasi</span></div>
      <div className="progress-groups">
        <span>Ruang PTI <strong>{ptiCount}/{ptiTotal}</strong></span>
        <span>Ikon UMS <strong>{umsCount}/{umsTotal}</strong></span>
      </div>
    </aside>
  );
}

function NearbyPrompt() {
  const nearbyId = useExperience((state) => state.nearbyLocationId);
  const activeId = useExperience((state) => state.activeLocationId);
  const mapOpen = useExperience((state) => state.mapOpen);
  const helpOpen = useExperience((state) => state.helpOpen);
  const openLocation = useExperience((state) => state.openLocation);
  const location = getLocation(nearbyId);

  if (!location || activeId || mapOpen || helpOpen) return null;

  return (
    <div className="nearby-prompt">
      <span><MapPin size={18} weight="fill" /> {location.mapLabel}</span>
      <button type="button" onClick={() => openLocation(location.id)}>
        Lihat informasi <kbd>E</kbd>
      </button>
    </div>
  );
}

function PhotoCarousel({ photos, title, category }: { photos: string[]; title: string; category: string }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((i) => (i + 1) % photos.length), 4000);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [photos.length]);

  const go = (idx: number) => { setCurrent((idx + photos.length) % photos.length); resetTimer(); };
  const photoUrl = (src: string) => `${import.meta.env.BASE_URL}${src.replace(/^\//, "")}`;

  return (
    <div className="location-carousel" aria-label={`Foto ${title}`}>
      <div className="location-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {photos.map((src, i) => (
          <img key={src} src={photoUrl(src)} alt={`${title} foto ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button className="carousel-arrow carousel-arrow-prev" onClick={() => go(current - 1)} aria-label="Foto sebelumnya">&#8249;</button>
          <button className="carousel-arrow carousel-arrow-next" onClick={() => go(current + 1)} aria-label="Foto berikutnya">&#8250;</button>
          <div className="carousel-dots">
            {photos.map((_, i) => (
              <button key={i} className={`carousel-dot ${i === current ? "is-active" : ""}`} onClick={() => go(i)} aria-label={`Foto ${i + 1}`} />
            ))}
          </div>
        </>
      )}
      <span className="carousel-badge">{category === "pti_fkip" ? "Ruang PTI dan FKIP" : "Landmark UMS"}</span>
    </div>
  );
}

function LocationModal() {
  const activeId = useExperience((state) => state.activeLocationId);
  const closeLocation = useExperience((state) => state.closeLocation);
  const location = getLocation(activeId);
  if (!location) return null;

  return (
    <Dialog title={location.title} onClose={closeLocation} className="location-dialog">
      {location.photos && location.photos.length > 0 ? (
        <PhotoCarousel photos={location.photos} title={location.title} category={location.category} />
      ) : (
        <div className="location-art" style={{ "--location-accent": location.accent } as React.CSSProperties}>
          <Buildings size={78} weight="duotone" aria-hidden="true" />
          <span>{location.category === "pti_fkip" ? "Ruang PTI dan FKIP" : "Landmark UMS"}</span>
        </div>
      )}
      <div className="location-content">
        <div className="location-heading">
          <span>{location.id}</span>
          <h2>{location.title}</h2>
        </div>
        <p className="location-description">{location.shortDescription}</p>
        <div className="fact-grid">
          <div>
            <span>Fungsi utama</span>
            <p>{location.primaryFunction}</p>
          </div>
          <div>
            <span>Fakta menarik</span>
            <p>{location.interestingFact}</p>
          </div>
        </div>
        <div className="visited-confirmation"><CheckCircle size={20} weight="fill" /> Lokasi tercatat dalam perjalananmu</div>
        {location.link && (
          <a
            className="primary-button full-button location-link-button"
            href={location.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArrowSquareOut size={18} weight="bold" />
            {location.linkLabel ?? `Kunjungi ${location.title}`}
          </a>
        )}
        <button className="primary-button full-button" type="button" onClick={closeLocation}>Tutup dan lanjut jelajah</button>
      </div>
    </Dialog>
  );
}

function HelpModal() {
  const helpOpen = useExperience((state) => state.helpOpen);
  const setHelpOpen = useExperience((state) => state.setHelpOpen);
  if (!helpOpen) return null;

  return (
    <Dialog title="Panduan jelajah" onClose={() => setHelpOpen(false)} className="help-dialog">
      <p className="eyebrow">Panduan singkat</p>
      <h2>Jalan santai, temukan kampusmu.</h2>
      <p className="dialog-intro">Dekati penanda di depan gedung, lalu buka informasi untuk mencatat kunjungan.</p>
      <div className="control-grid">
        <div><Keyboard size={28} /><strong>WASD atau panah</strong><span>Berjalan di desktop</span></div>
        <div><HandTap size={28} /><strong>Tombol arah</strong><span>Berjalan di ponsel</span></div>
        <div><MapPin size={28} /><strong>E atau tombol</strong><span>Buka informasi lokasi</span></div>
        <div><MapTrifold size={28} /><strong>Peta</strong><span>Lihat seluruh destinasi</span></div>
      </div>
      <button className="primary-button full-button" type="button" onClick={() => setHelpOpen(false)}>Siap menjelajah</button>
    </Dialog>
  );
}

function CampusMap() {
  const mapOpen = useExperience((state) => state.mapOpen);
  const setMapOpen = useExperience((state) => state.setMapOpen);
  const visited = useExperience((state) => state.visitedLocationIds);
  if (!mapOpen) return null;

  return (
    <Dialog title="Peta kampus" onClose={() => setMapOpen(false)} className="map-dialog">
      <div className="map-heading">
        <div>
          <p className="eyebrow">Peta perjalanan</p>
          <h2>{locations.length} tempat untuk dikenali.</h2>
        </div>
        <p>{visited.length} lokasi sudah dikunjungi.</p>
      </div>
      <div className="map-layout">
        <div className="campus-map" aria-label="Peta skematik lokasi">
          <div className="map-zone map-zone-kampus-1"><span>Kampus 1</span></div>
          <div className="map-zone map-zone-kampus-2"><span>Kampus 2</span></div>
          <div className="map-zone map-zone-edutorium"><span>Edutorium</span></div>
          <div className="map-road road-horizontal" />
          <div className="map-road road-horizontal-north" />
          <div className="map-road road-vertical-left" />
          <div className="map-road road-vertical-right" />
          <div className="map-river" aria-hidden="true" />
          {locations.map((location) => {
            const left = `${((location.position[0] + 48) / 96) * 100}%`;
            const top = `${((location.position[2] + 48) / 96) * 100}%`;
            const isVisited = visited.includes(location.id);
            return (
              <span
                key={location.id}
                className={`map-pin ${isVisited ? "is-visited" : ""}`}
                style={{ left, top, "--pin-color": location.accent } as React.CSSProperties}
                role="img"
                aria-label={`${location.title}${isVisited ? ", sudah dikunjungi" : ""}`}
                title={location.title}
              >
                {isVisited ? <CheckCircle size={17} weight="fill" /> : location.id.replace("L", "")}
              </span>
            );
          })}
        </div>
        <div className="map-list">
          <section>
            <h3>Kampus 1</h3>
            {locations.filter((location) => location.campusArea === "kampus_1").sort((a, b) => a.id.localeCompare(b.id)).map((location) => (
              <div key={location.id} className={visited.includes(location.id) ? "visited" : ""}>
                <span>{visited.includes(location.id) ? <CheckCircle size={18} weight="fill" /> : location.id.replace("L", "")}</span>
                {location.mapLabel}
              </div>
            ))}
          </section>
          <section>
            <h3>Kampus 2</h3>
            {locations.filter((location) => location.campusArea === "kampus_2").sort((a, b) => a.id.localeCompare(b.id)).map((location) => (
              <div key={location.id} className={visited.includes(location.id) ? "visited" : ""}>
                <span>{visited.includes(location.id) ? <CheckCircle size={18} weight="fill" /> : location.id.replace("L", "")}</span>
                {location.mapLabel}
              </div>
            ))}
          </section>
          <section>
            <h3>Edutorium</h3>
            {locations.filter((location) => location.campusArea === "edutorium").map((location) => (
              <div key={location.id} className={visited.includes(location.id) ? "visited" : ""}>
                <span>{visited.includes(location.id) ? <CheckCircle size={18} weight="fill" /> : location.id.replace("L", "")}</span>
                {location.mapLabel}
              </div>
            ))}
          </section>
        </div>
      </div>
    </Dialog>
  );
}

function CompletionModal() {
  const open = useExperience((state) => state.completionOpen);
  const setOpen = useExperience((state) => state.setCompletionOpen);
  const resetProgress = useExperience((state) => state.resetProgress);
  const [resetPending, setResetPending] = useState(false);
  if (!open) return null;

  return (
    <Dialog title="Jelajah selesai" onClose={() => setOpen(false)} className="completion-dialog">
      <div className="completion-seal"><CheckCircle size={54} weight="fill" /></div>
      <p className="eyebrow">Perjalanan lengkap</p>
      <h2>Kamu sudah mengenal PTI dan UMS.</h2>
      <p>Terima kasih telah mengunjungi seluruh ruang belajar dan landmark dalam Jelajah PTI-UMS.</p>
      <a className="primary-button full-button" href="https://pti.ums.ac.id/" target="_blank" rel="noopener noreferrer">
        Kunjungi website PTI UMS <ArrowSquareOut size={20} weight="bold" />
      </a>
      {resetPending ? (
        <div className="reset-confirmation" role="alert">
          <p>Hapus seluruh status kunjungan di perangkat ini?</p>
          <div>
            <button type="button" onClick={() => setResetPending(false)}>Batal</button>
            <button type="button" onClick={() => { resetProgress(); setResetPending(false); }}>Hapus progres</button>
          </div>
        </div>
      ) : (
        <button className="text-button" type="button" onClick={() => setResetPending(true)}>
          <ArrowCounterClockwise size={18} /> Mulai ulang progres
        </button>
      )}
    </Dialog>
  );
}

function TouchControls() {
  const setMoveInput = useExperience((state) => state.setMoveInput);
  const setDirection = (x: number, z: number) => setMoveInput({ x, z });
  const stop = () => setMoveInput({ x: 0, z: 0 });
  const bind = (x: number, z: number) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setDirection(x, z);
    },
    onPointerUp: stop,
    onPointerCancel: stop,
    onPointerLeave: stop,
  });

  return (
    <div
      className="touch-controls"
      aria-label="Kontrol berjalan"
      onContextMenu={(event) => event.preventDefault()}
    >
      <button type="button" aria-label="Jalan maju" {...bind(0, -1)}>↑</button>
      <button type="button" aria-label="Jalan ke kiri" {...bind(-1, 0)}>←</button>
      <button type="button" aria-label="Jalan ke kanan" {...bind(1, 0)}>→</button>
      <button type="button" aria-label="Jalan mundur" {...bind(0, 1)}>↓</button>
    </div>
  );
}

export function Interface() {
  const started = useExperience((state) => state.started);
  if (!started) return <><BackgroundAudio /><StartScreen /></>;

  return (
    <>
      <BackgroundAudio />
      <div className="interface-layer">
        <Header />
        <ProgressPanel />
        <NearbyPrompt />
        <TouchControls />
        <LocationModal />
        <HelpModal />
        <CampusMap />
        <CompletionModal />
      </div>
    </>
  );
}
