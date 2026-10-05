// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { FishingOverlay } from './FishingOverlay';
import { REEL_DURATION } from './game';
import { useFishing } from './useFishing';
import { useExperience } from '../store/useExperience';
let root: ReturnType<typeof createRoot>;
let container: HTMLDivElement;
beforeEach(async () => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 42));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  container = document.createElement('div'); document.body.append(container);
  root = createRoot(container);
  useExperience.setState({ started: true, activeLocationId: null, helpOpen: false, mapOpen: false, completionOpen: false, soundEnabled: false });
  useFishing.setState({ session: { phase: 'ready' }, nearby: true, collection: {}, storageFailed: false });
  await act(async () => root.render(<FishingOverlay />));
});
afterEach(async () => {
  await act(async () => root.unmount()); container.remove(); vi.unstubAllGlobals(); vi.restoreAllMocks();
});
it('cancels a pending attempt on blur and removes its animation loop on exit', async () => {
  await act(async () => { useFishing.getState().cast(); window.dispatchEvent(new Event('blur')); });
  expect(useFishing.getState().session.phase).toBe('ready');
  await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' })));
  expect(container.querySelector('.fishing-panel')).toBeNull();
  expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
});
it('Space catches on keydown even with the pull button focused; repeats do not count twice', async () => {
  vi.spyOn(performance, 'now').mockReturnValue(3750);
  await act(async () => useFishing.setState({ session: { phase: 'timing', biteAt: 3000, fishId: 'nila' } }));
  const button = container.querySelector('.fishing-primary')!;
  await act(async () => button.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true, cancelable: true })));
  await act(async () => window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', repeat: true })));
  expect(container.textContent).toContain('Tarik ikannya!');
  await act(async () => useFishing.getState().tick(3750 + REEL_DURATION));
  expect(useFishing.getState().collection.nila.count).toBe(1);
  expect(container.textContent).toContain('Nila tertangkap!');
});
it('opening help closes the panel and does not preserve a running attempt', async () => {
  await act(async () => { useFishing.getState().cast(); useExperience.getState().setHelpOpen(true); });
  expect(useFishing.getState().session.phase).toBe('idle');
  expect(container.querySelector('.fishing-panel')).toBeNull();
});
