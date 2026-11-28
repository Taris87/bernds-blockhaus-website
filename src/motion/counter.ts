import { gsap } from './gsap';

interface Running {
  tween: gsap.core.Tween;
  overlay: HTMLSpanElement;
  color: string;
  positioned: boolean;
}

const running = new WeakMap<HTMLElement, Running>();

/** Splits “~150”, “60 qm”, “39” into prefix, number and suffix. */
export function parseCounter(text: string) {
  const match = /^(\D*)(\d+)(.*)$/s.exec(text.trim());
  if (!match) return null;
  return { prefix: match[1] ?? '', value: Number(match[2]), suffix: match[3] ?? '' };
}

/** Removes a running count-up and restores the element's own text. */
export function stopCounter(element: HTMLElement) {
  const state = running.get(element);
  if (!state) return;
  running.delete(element);
  state.tween.kill();
  state.overlay.remove();
  element.style.color = state.color;
  if (state.positioned) element.style.removeProperty('position');
  if (!element.getAttribute('style')) element.removeAttribute('style');
}

/**
 * Counts a number up (Kap. 7.1 “Zähler”). The element's own text – the end
 * value – never changes, so the DOM and the accessible name always hold the
 * correct number. Only an `aria-hidden` duplicate on top of the transparent
 * original counts; it is removed at the end. Width stays fixed because the
 * original text keeps reserving its space (no layout shift).
 */
export function countUp(element: HTMLElement, options: { from?: number; duration?: number; paused?: boolean } = {}) {
  stopCounter(element);
  const parsed = parseCounter(element.textContent ?? '');
  if (!parsed) return null;
  const from = options.from ?? 0;
  if (from === parsed.value) return null;

  const overlay = document.createElement('span');
  overlay.className = 'counter-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.style.color = getComputedStyle(element).color;
  const color = element.style.color;
  element.style.color = 'transparent';
  const positioned = getComputedStyle(element).position === 'static';
  if (positioned) element.style.position = 'relative';
  element.append(overlay);

  const counter = { value: from };
  const render = () => {
    overlay.textContent = `${parsed.prefix}${Math.round(counter.value)}${parsed.suffix}`;
  };
  render();
  const tween = gsap.to(counter, {
    value: parsed.value,
    duration: options.duration ?? 1.2,
    ease: 'power2.out',
    paused: options.paused ?? false,
    onUpdate: render,
    onComplete: () => stopCounter(element),
  });
  running.set(element, { tween, overlay, color, positioned });
  return tween;
}
