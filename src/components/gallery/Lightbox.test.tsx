import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Lightbox } from './Lightbox';
import { galleryItems } from '../../data/gallery';

// These jsdom tests mock showModal()/close() only to exercise React effect,
// cleanup and callback scheduling. They do not prove native dialog modality,
// inert background behavior, browser focus trapping, or native cancel semantics.
// Those browser semantics are covered by the Playwright Chromium suite.

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
  await act(async () => {
    trigger?.focus();
    trigger?.click();
  });
  await act(async () => { await Promise.resolve(); });
  return trigger!;
}

describe('Lightbox Strict Mode lifecycle', () => {
  it('ignores a stale opening microtask after unmount and remount of a new instance', async () => {
    const queuedMicrotasks: VoidFunction[] = [];
    const originalQueueMicrotask = globalThis.queueMicrotask;
    const queueMicrotaskSpy = vi.spyOn(globalThis, 'queueMicrotask').mockImplementation((callback) => {
      queuedMicrotasks.push(callback);
    });

    await act(async () => {
      root.render(<StrictMode><GalleryHarness /></StrictMode>);
    });
    const oldTrigger = container.querySelector<HTMLButtonElement>('button');
    expect(oldTrigger).not.toBeNull();
    await act(async () => {
      oldTrigger?.focus();
      oldTrigger?.click();
    });

    const oldOpeningTasks = [...queuedMicrotasks];
    expect(oldOpeningTasks.length).toBeGreaterThan(0);
    expect(showModalCalls).toBe(0);

    await act(async () => {
      root.render(<p>Interim route</p>);
    });
    expect(container.querySelector('dialog')).toBeNull();
    expect(oldTrigger?.isConnected).toBe(false);

    queuedMicrotasks.length = 0;
    await act(async () => {
      root.render(<StrictMode><GalleryHarness /></StrictMode>);
    });
    const newTrigger = container.querySelector<HTMLButtonElement>('button');
    expect(newTrigger).not.toBeNull();
    expect(newTrigger).not.toBe(oldTrigger);

    await act(async () => {
      newTrigger?.focus();
      newTrigger?.click();
    });
    const newOpeningTasks = [...queuedMicrotasks];
    expect(newOpeningTasks.length).toBeGreaterThan(0);

    // Deliberately run the old queued callbacks after the new instance has
    // mounted but before its own open callback is allowed to execute.
    await act(async () => {
      oldOpeningTasks.forEach((callback) => callback());
    });

    expect(showModalCalls).toBe(0);
    expect(container.querySelector('dialog[open]')).toBeNull();
    expect(document.activeElement).not.toBe(oldTrigger);
    expect(document.activeElement).not.toBe(newTrigger);

    await act(async () => {
      newOpeningTasks.forEach((callback) => callback());
    });

    expect(showModalCalls).toBe(1);
    expect(container.querySelector('dialog[open]')).not.toBeNull();
    expect(document.activeElement).toBe(container.querySelector('.lightbox-close'));
    expect(document.activeElement).not.toBe(oldTrigger);

    queueMicrotaskSpy.mockRestore();
    expect(globalThis.queueMicrotask).toBe(originalQueueMicrotask);
  });
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
    const focusCallsBeforeUnmount = focusSpy.mock.contexts.length;
    await act(async () => {
      root.render(<p>New route content</p>);
    });
    await act(async () => { await Promise.resolve(); });

    expect(trigger.isConnected).toBe(false);
    expect(focusSpy.mock.contexts.slice(focusCallsBeforeUnmount)).not.toContain(trigger);
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
