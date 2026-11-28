import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { countUp, parseCounter, stopCounter } from './counter';
import { motionAllowed, normaliseConditions, type MotionConditions } from './media';
import { useMotion } from './useMotion';
import { Marquee } from '../components/ui/Marquee';

/** matchMedia stub that answers per query. */
function stubMedia(answers: Record<string, boolean>) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: answers[query] ?? false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('media conditions', () => {
  it('lets reduced motion win over no-preference', () => {
    expect(normaliseConditions({ motion: true, reduce: true, parallax: true })).toEqual({
      motion: false,
      reduce: true,
      mobile: false,
      parallax: false,
    });
    expect(normaliseConditions({ motion: true, parallax: true }).parallax).toBe(true);
  });

  it('reports motion only when no-preference matches and reduce does not', () => {
    stubMedia({ '(prefers-reduced-motion: no-preference)': true });
    expect(motionAllowed()).toBe(true);
    stubMedia({ '(prefers-reduced-motion: no-preference)': true, '(prefers-reduced-motion: reduce)': true });
    expect(motionAllowed()).toBe(false);
    stubMedia({});
    expect(motionAllowed()).toBe(false);
  });
});

describe('counter', () => {
  it('parses prefix, number and suffix', () => {
    expect(parseCounter('~150')).toEqual({ prefix: '~', value: 150, suffix: '' });
    expect(parseCounter('60 qm')).toEqual({ prefix: '', value: 60, suffix: ' qm' });
    expect(parseCounter('Fotos')).toBeNull();
  });

  it('keeps the end value as text and counts on an aria-hidden duplicate', () => {
    const element = document.createElement('dd');
    element.textContent = '~150';
    document.body.append(element);
    const tween = countUp(element, { paused: true });
    expect(tween).not.toBeNull();
    const overlay = element.querySelector('.counter-overlay');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay).toHaveTextContent('~0');
    expect(element.firstChild?.textContent).toBe('~150');

    tween!.progress(1);
    expect(element.querySelector('.counter-overlay')).toBeNull();
    expect(element).toHaveTextContent('~150');
    expect(element.getAttribute('style')).toBeNull();
    element.remove();
  });

  it('cleans up when stopped early', () => {
    const element = document.createElement('b');
    element.textContent = '39';
    document.body.append(element);
    countUp(element, { from: 16, paused: true });
    stopCounter(element);
    expect(element.querySelector('.counter-overlay')).toBeNull();
    expect(element.getAttribute('style')).toBeNull();
    element.remove();
  });
});

function Probe({ setup }: { setup: (conditions: MotionConditions) => void | (() => void) }) {
  const ref = useRef<HTMLDivElement>(null);
  useMotion(setup, { scope: ref });
  return <div ref={ref}>probe</div>;
}

describe('useMotion', () => {
  it('runs the setup with normalised conditions and cleans up on unmount', () => {
    stubMedia({ '(prefers-reduced-motion: no-preference)': true, '(max-width: 767px)': true });
    const cleanup = vi.fn();
    const setup = vi.fn((conditions: MotionConditions) => (conditions ? cleanup : undefined));
    const { unmount } = render(<Probe setup={setup} />);
    expect(setup.mock.calls[0]?.[0]).toEqual({ motion: true, reduce: false, mobile: true, parallax: false });
    unmount();
    expect(cleanup).toHaveBeenCalled();
  });

  it('reports reduced motion to the setup', () => {
    stubMedia({ '(prefers-reduced-motion: reduce)': true });
    const setup = vi.fn((conditions: MotionConditions) => void conditions);
    render(<Probe setup={setup} />);
    expect(setup.mock.calls[0]?.[0]).toMatchObject({ motion: false, reduce: true });
  });
});

describe('Marquee without motion', () => {
  it('renders without a tween and keeps the pause button operable', () => {
    render(<Marquee items={['Pfälzer Küche', 'Islandpferde']} pauseLabel="Laufband anhalten" />);
    const toggle = screen.getByRole('button', { name: 'Laufband anhalten' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    toggle.click();
    expect(document.querySelector('[data-marquee-track]')?.getAttribute('style')).toBeNull();
  });
});
