import { Flip, gsap } from './gsap';
import { isMobile, motionAllowed } from './media';

const CLEAR = 'transform,opacity,visibility';

function parts(dialog: HTMLElement) {
  return {
    scrim: dialog.querySelector<HTMLElement>('.lightbox-scrim'),
    frame: dialog.querySelector<HTMLElement>('.lightbox-frame'),
    chrome: [...dialog.querySelectorAll<HTMLElement>('.lightbox-top, .lightbox-controls, .lightbox-caption, .lightbox-film')],
  };
}

/** The gallery tile that shares the frame's `data-flip-id` – only if it is on screen. */
function visibleTile(dialog: HTMLElement, id: string) {
  const tile = [...document.querySelectorAll<HTMLElement>(`[data-flip-id="${CSS.escape(id)}"]`)].find(
    (element) => !dialog.contains(element),
  );
  if (!tile) return null;
  const box = tile.getBoundingClientRect();
  const visible = box.bottom > 0 && box.top < window.innerHeight && box.width > 0;
  return visible ? tile : null;
}

/**
 * Lightbox opening (Kap. 7.1): the photo grows from its gallery tile into the
 * frame (Flip via the shared `data-flip-id`), the dark surface fades in, the
 * controls follow. Mobile: fade + scale .96 → 1, no Flip. Focus handling is
 * untouched (the dialog is already open and focused when this runs).
 */
export function openLightbox(dialog: HTMLElement, id: string) {
  if (!motionAllowed()) return null;
  const { scrim, frame, chrome } = parts(dialog);
  const timeline = gsap.timeline();
  if (scrim) {
    timeline.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out', clearProps: CLEAR }, 0);
  }
  const tile = isMobile() ? null : visibleTile(dialog, id);
  if (frame && tile) {
    timeline.add(Flip.from(Flip.getState(tile), { targets: frame, duration: 0.55, ease: 'power3.inOut', scale: true }), 0);
    timeline.set(frame, { clearProps: CLEAR });
  } else if (frame) {
    timeline.fromTo(
      frame,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', clearProps: CLEAR },
      0,
    );
  }
  if (chrome.length) {
    // Opacity only: the controls are usable (and focused) from the first frame
    // and never move under the pointer or a click.
    timeline.fromTo(chrome, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out', clearProps: CLEAR }, 0.15);
  }
  return timeline;
}

/**
 * Lightbox closing (≈ 0.35 s, deliberately quicker than the opening so the
 * page is back right away): the photo flies back onto its tile (if visible), the
 * surface fades out; `done` then unmounts the dialog, whose cleanup returns
 * focus exactly as before. Without motion `done` runs immediately.
 */
export function closeLightbox(dialog: HTMLElement, id: string, done: () => void) {
  if (!motionAllowed()) {
    done();
    return null;
  }
  const { scrim, frame, chrome } = parts(dialog);
  const timeline = gsap.timeline({ onComplete: done });
  if (chrome.length) timeline.to(chrome, { opacity: 0, duration: 0.12, ease: 'power1.in' }, 0);
  const tile = isMobile() ? null : visibleTile(dialog, id);
  if (frame && tile) {
    const fit = Flip.fit(frame, tile, { duration: 0.32, ease: 'power3.inOut', scale: true });
    if (fit && typeof fit !== 'boolean' && 'duration' in fit) timeline.add(fit as gsap.core.Tween, 0);
    timeline.to(frame, { opacity: 0, duration: 0.06 }, 0.28);
  } else if (frame) {
    timeline.to(frame, { opacity: 0, scale: 0.96, duration: 0.22, ease: 'power2.in' }, 0);
  }
  if (scrim) timeline.to(scrim, { opacity: 0, duration: 0.24, ease: 'power1.in' }, 0.1);
  return timeline;
}

/** Next/previous photo: the new one slides in by 40 px from the side it came from. */
export function stepLightbox(dialog: HTMLElement, direction: -1 | 1, fromX?: number) {
  const { frame } = parts(dialog);
  if (!frame || !motionAllowed()) return null;
  return gsap.fromTo(
    frame,
    { x: fromX ?? direction * 40, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.35, ease: 'power2.out', clearProps: CLEAR },
  );
}

/** Follow the finger while swiping (motion only). */
export function dragLightbox(dialog: HTMLElement, dx: number) {
  const { frame } = parts(dialog);
  if (frame && motionAllowed()) gsap.set(frame, { x: dx * 0.6 });
}

/** Swipe below the threshold: snap back. */
export function snapBackLightbox(dialog: HTMLElement) {
  const { frame } = parts(dialog);
  if (!frame) return;
  if (motionAllowed()) gsap.to(frame, { x: 0, duration: 0.25, ease: 'power2.out', clearProps: CLEAR });
  else gsap.set(frame, { clearProps: CLEAR });
}
