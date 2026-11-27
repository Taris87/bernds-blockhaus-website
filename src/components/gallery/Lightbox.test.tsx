import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Lightbox } from './Lightbox';
import { galleryItems } from '../../data/gallery';

let container: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
let showModalCalls: number;
let closeDialogCalls: number;
let addedListeners: EventListener[];
let removedListeners: EventListener[];

beforeEach(() => {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  showModalCalls = 0;
  closeDialogCalls = 0;
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      showModalCalls += 1;
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      closeDialogCalls += 1;
      this.removeAttribute('open');
    },
  });
  addedListeners = [];
  removedListeners = [];
  const originalAdd = document.addEventListener.bind(document);
  const originalRemove = document.removeEventListener.bind(document);
  vi.spyOn(document, 'addEventListener').mockImplementation((type, listener, options) => {
    if (type === 'keydown' && typeof listener === 'function') addedListeners.push(listener as EventListener);
    originalAdd(type, listener, options);
  });
  vi.spyOn(document, 'removeEventListener').mockImplementation((type, listener, options) => {
    if (type === 'keydown' && typeof listener === 'function') removedListeners.push(listener as EventListener);
    originalRemove(type, listener, options);
  });
});

afterEach(async () => {
  await act(async () => root.unmount());
  vi.restoreAllMocks();
  delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal;
  delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close;
  container.remove();
});

function renderLightbox(onClose = vi.fn()) {
  const item = galleryItems[0]!;
  act(() => root.render(<StrictMode><button type="button">Gallery trigger</button><Lightbox item={item} onClose={onClose} onPrevious={vi.fn()} onNext={vi.fn()} /></StrictMode>));
  return onClose;
}

describe('Lightbox Strict Mode lifecycle', () => {
  it('activates the dialog once after Strict Mode effect replay and removes its key listener', async () => {
    renderLightbox();
    await act(async () => { await Promise.resolve(); });

    expect(showModalCalls).toBe(1);
    expect(container.querySelector('dialog')).toHaveAttribute('open');
    expect(addedListeners.length).toBe(2);
    expect(removedListeners.length).toBe(1);

    await act(async () => root.unmount());
    await act(async () => { await Promise.resolve(); });
    expect(removedListeners.length).toBe(2);
    expect(closeDialogCalls).toBe(1);
  });

  it('does not focus the detached trigger after a final unmount', async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    renderLightbox();
    await act(async () => { await Promise.resolve(); });
    const trigger = Array.from(container.querySelectorAll('button')).find((button) => button.textContent === 'Gallery trigger');
    expect(trigger).toBeDefined();

    await act(async () => root.unmount());
    await act(async () => { await Promise.resolve(); });

    expect(trigger?.isConnected).toBe(false);
    expect(focusSpy.mock.instances.some((element) => element === trigger)).toBe(false);
    expect(document.activeElement).not.toBe(trigger);
  });

  it('restores focus to the connected trigger after an ordinary close', async () => {
    renderLightbox();
    await act(async () => { await Promise.resolve(); });
    const trigger = Array.from(container.querySelectorAll('button')).find((button) => button.textContent === 'Gallery trigger');
    expect(trigger).toBeDefined();

    const close = container.querySelector<HTMLButtonElement>('.lightbox-close');
    await act(async () => close?.click());
    await act(async () => { await Promise.resolve(); });

    expect(trigger?.isConnected).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });
});
