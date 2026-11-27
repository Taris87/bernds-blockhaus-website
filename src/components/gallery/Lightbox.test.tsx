import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Lightbox } from './Lightbox';
import { galleryItems } from '../../data/gallery';

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
let showModal: ReturnType<typeof vi.fn>;
let closeDialog: ReturnType<typeof vi.fn>;
let addedListeners: EventListener[];
let removedListeners: EventListener[];

beforeEach(() => {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  showModal = vi.fn(function (this: HTMLDialogElement) { this.setAttribute('open', ''); });
  closeDialog = vi.fn(function (this: HTMLDialogElement) { this.removeAttribute('open'); });
  vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(showModal);
  vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(closeDialog);
  addedListeners = [];
  removedListeners = [];
  vi.spyOn(document, 'addEventListener').mockImplementation((type, listener, options) => {
    if (type === 'keydown' && typeof listener === 'function') addedListeners.push(listener as EventListener);
    return EventTarget.prototype.addEventListener.call(document, type, listener, options);
  });
  vi.spyOn(document, 'removeEventListener').mockImplementation((type, listener, options) => {
    if (type === 'keydown' && typeof listener === 'function') removedListeners.push(listener as EventListener);
    return EventTarget.prototype.removeEventListener.call(document, type, listener, options);
  });
});

afterEach(async () => {
  await act(async () => root.unmount());
  vi.restoreAllMocks();
  container.remove();
});

function renderLightbox(onClose = vi.fn()) {
  act(() => root.render(<StrictMode><button type="button">Gallery trigger</button><Lightbox item={galleryItems[0]} onClose={onClose} onPrevious={vi.fn()} onNext={vi.fn()} /></StrictMode>));
  return onClose;
}

describe('Lightbox Strict Mode lifecycle', () => {
  it('activates the dialog once after Strict Mode effect replay and removes its key listener once', async () => {
    renderLightbox();
    await act(async () => { await Promise.resolve(); });

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(container.querySelector('dialog')).toHaveAttribute('open');
    expect(addedListeners.length).toBe(2);
    expect(removedListeners.length).toBe(1);

    await act(async () => root.unmount());
    await act(async () => { await Promise.resolve(); });
    expect(removedListeners.length).toBe(2);
    expect(closeDialog).toHaveBeenCalledTimes(1);
  });

  it('does not focus the detached trigger after a final unmount', async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    renderLightbox();
    await act(async () => { await Promise.resolve(); });
    const trigger = container.querySelector('button');
    expect(trigger).not.toBeNull();

    await act(async () => root.unmount());
    await act(async () => { await Promise.resolve(); });

    expect(trigger?.isConnected).toBe(false);
    expect(focusSpy.mock.instances.some((element) => element === trigger)).toBe(false);
    expect(document.activeElement).not.toBe(trigger);
  });

  it('restores focus to the connected trigger after an ordinary close', async () => {
    renderLightbox();
    await act(async () => { await Promise.resolve(); });
    const trigger = container.querySelector('button');
    expect(trigger).not.toBeNull();

    const close = container.querySelector<HTMLButtonElement>('.lightbox-close');
    await act(async () => close?.click());
    await act(async () => { await Promise.resolve(); });

    expect(trigger?.isConnected).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });
});
