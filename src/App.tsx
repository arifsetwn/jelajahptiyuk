import { Component, type ErrorInfo, type ReactNode } from "react";
import { Buildings, WarningCircle } from "@phosphor-icons/react";
import { CampusScene } from "./components/CampusScene";
import { Interface } from "./components/Interface";
import { locations } from "./data/locations";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function StaticFallback() {
  return (
    <main className="fallback-page">
      <div className="fallback-heading">
        <div className="brand-lockup"><span className="brand-mark"><Buildings size={28} weight="fill" /></span><span>Jelajah PTI</span><small>UMS</small></div>
        <WarningCircle size={34} weight="duotone" />
        <h1>Versi 3D belum tersedia di perangkat ini.</h1>
        <p>Kamu tetap dapat mengenal seluruh ruang PTI dan landmark UMS melalui daftar berikut.</p>
      </div>
      <div className="fallback-grid">
        {locations.map((location) => (
          <article key={location.id}>
            <span>{location.id}</span>
            <h2>{location.title}</h2>
            <p>{location.shortDescription}</p>
          </article>
        ))}
      </div>
      <a className="primary-button" href="https://pti.ums.ac.id/" target="_blank" rel="noopener noreferrer">Kunjungi website PTI UMS</a>
    </main>
  );
}

interface BoundaryState {
  failed: boolean;
}

class SceneErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Scene 3D gagal dimuat", error, info.componentStack);
  }

  render() {
    return this.state.failed ? <StaticFallback /> : this.props.children;
  }
}

export default function App() {
  if (!supportsWebGL()) return <StaticFallback />;

  return (
    <SceneErrorBoundary>
      <main className="app-shell">
        <div className="canvas-layer" aria-label="Miniatur kampus UMS tiga dimensi">
          <CampusScene />
        </div>
        <Interface />
      </main>
    </SceneErrorBoundary>
  );
}
