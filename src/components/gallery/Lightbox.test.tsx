import { StrictMode, useState } from 'react';
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

function GalleryHarness() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>Gallery trigger</button>
      {isOpen && (
        <Lightbox
          item={galleryItems[0]!}
          onClose={() => setIsOpen(false)}
          onPrevious={vi.fn()}
          onNext={vi.fn()}
        />
      )}
    </>
  );
}

async function renderGallery(strict = true) {
  await act(async () => {
    root.render(strict ? <StrictMode><GalleryHarness /></StrictMode> : <GalleryHarness />);
  });
  const trigger = container.querySelector<HTMLButtonElement>('button');
  expect(trigger).not.toBeNull();
  await act(async () => trigger?.click());
  await act(async () => { await Promise.resolve(); });
  return trigger!;
}

describe('Lightbox Strict Mode lifecycle', () => {
  it('activates the dialog once after Strict Mode effect replay and removes its key listener', async () => {
    const trigger = await renderGallery(true);

    expect(showModalCalls).toBe(1);
    expect(container.querySelector('dialog')).toHaveAttribute('open');
    expect(addedListeners.length).toBe(2);
    expect(removedListeners.length).toBe(1);

    const close = container.querySelector<HTMLButtonElement>('.lightbox-close');
    await act(async () => close?.click());
    await act(async () => { await Promise.resolve(); });

    expect(closeDialogCalls).toBe(1);
    expect(removedListeners.length).toBe(2);
    expect(trigger.isConnected).toBe(true);
    expect(document.activeElement).toBe(trigger);
  });

  it('does not focus the detached trigger after unmounting while the dialog is open', async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    const trigger = await renderGallery(true);

    expect(container.querySelector('dialog[open]')).not.toBeNull();
    await act(async () => {
      root.render(<p>New route content</p>);
    });
    await act(async () => { await Promise.resolve(); });

    expect(trigger.isConnected).toBe(false);
    expect(focusSpy.mock.instances.some((element) => element === trigger)).toBe(false);
    expect(document.activeElement).not.toBe(trigger);
    expect(container.querySelector('dialog')).toBeNull();
    expect(removedListeners.length).toBe(2);
  });

  it('unmounts and remounts a gallery with a fresh trigger and no stale focus restore', async () => {
    const oldTrigger = await renderGallery(true);

    await act(async () => {
      root.render(<p>Another route</p>);
    });
    await act(async () => { await Promise.resolve(); });
    expect(oldTrigger.isConnected).toBe(false);
    expect(document.activeElement).not.toBe(oldTrigger);

    await act(async () => {
      root.render(<StrictMode><GalleryHarness /></StrictMode>);
    });
    const newTrigger = container.querySelector<HTMLButtonElement>('button');
    expect(newTrigger).not.toBeNull();
    expect(newTrigger).not.toBe(oldTrigger);

    await act(async () => newTrigger?.click());
    await act(async () => { await Promise.resolve(); });

    expect(container.querySelector('dialog[open]')).not.toBeNull();
    expect(showModalCalls).toBe(2);
    expect(document.activeElement).not.toBe(oldTrigger);
  });
});
