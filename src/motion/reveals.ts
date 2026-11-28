import { countUp, stopCounter } from './counter';
import { gsap, reachableStart, remeasureScrollTriggers, ScrollTrigger, SplitText } from './gsap';
import type { MotionConditions } from './media';

/*
 * Page motion (Kap. 7.1): hero entry, scroll reveals, counters, parallax.
 * Everything here runs inside a `useMotion` context and only when motion is
 * allowed; the context revert removes every inline style again.
 *
 * Rules: only transform, opacity and clip-path are animated; every reveal
 * plays once (no re-animation when scrolling back up); start states are set
 * here in JS, never in CSS.
 */

const SOFT_HYPHEN = String.fromCharCode(0xad);
const STRONG = 'power4.out';
const SOFT = 'power3.out';
const PIN_ROTATION_EASE = 'back.out(1.4)';
/** Inline props a reveal leaves behind; cleared so CSS (hover, tilt clamp) rules again. */
const CLEAR = 'transform,opacity,visibility,clipPath,transition';

/** Elements that already played their reveal – a later re-setup (breakpoint change) keeps them static. */
const revealed = new WeakSet<Element>();
/** The hero entry plays only on the first visit of the home page per page load. */
let heroPlayed = false;

/** Test hook: lets unit tests start from a clean state. */
export function resetRevealMemory() {
  heroPlayed = false;
}

export function fontsReady(timeout = 1500): Promise<void> {
  const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
  if (!fonts?.ready) return Promise.resolve();
  return Promise.race([
    fonts.ready.then(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, timeout)),
  ]);
}

/** Text a screen reader should hear for a split heading (line breaks become spaces). */
export function accessibleText(element: HTMLElement) {
  const text = element.innerText || element.textContent || '';
  return text.replace(new RegExp(SOFT_HYPHEN, "g"), '').replace(/\s+/g, ' ').trim();
}

/**
 * Scroll trigger for a one-time reveal. Deliberately NOT `once: true`: a
 * `once` trigger kills itself inside ScrollTrigger's refresh loop when it is
 * created below an already scrolled position (back/forward restore, reload
 * deep in the page) – that corrupts the trigger list and throws. The default
 * toggleActions ('play none none none') never reverse, so the reveal still
 * plays exactly once; the triggers die with the context revert.
 */
/** "top 85%" → 0.85 (fraction of the viewport height for reachableStart). */
function fractionOf(start: string) {
  const match = /top (\d+)%/.exec(start);
  return match ? Number(match[1]) / 100 : 0.85;
}

function enter(trigger: Element, start: string, members: Element[] = []) {
  return {
    trigger,
    // Reachable at the page end (QA-111), active at once in the first viewport (QA-119).
    start: reachableStart(fractionOf(start)),
    onEnter: () => {
      revealed.add(trigger);
      members.forEach((member) => revealed.add(member));
    },
  };
}

/** Inline props the motion layer may leave on an element. */
export const MOTION_PROPS = 'opacity,visibility,transform,translate,rotate,scale,clipPath,transition';

/**
 * After a matchMedia revert (breakpoint change) the rebuilt context must not
 * inherit any half state: everything that was already shown gets its motion
 * props cleared – outside the context, so the next revert cannot bring a
 * stale value back (QA-111).
 */
export function settleShown(context: gsap.Context, elements: Element[]) {
  if (!elements.length) return;
  context.ignore(() => gsap.set(elements, { clearProps: MOTION_PROPS }));
}

/** Everything that may carry a reveal start state. */
const MOTION_TARGETS = '[data-reveal], [data-counter], [data-parallax], .print, [data-reveal="clip"] img';

function pending<T extends Element>(elements: Iterable<T>, skip: Set<Element>) {
  return [...elements].filter((element) => !revealed.has(element) && !skip.has(element));
}

interface PinOptions {
  y: number;
  /** Absolute start rotation; `null` = start upright (0°) and rotate to the end tilt. */
  swing: number | null;
  duration?: number;
  keepTransform: boolean;
}

/** “Anpinnen”: a print lands on the wall – y + opacity, rotation with a slight overshoot. */
function pinTweens(timeline: gsap.core.Timeline, elements: Element[], position: number | string, stagger: number, options: PinOptions) {
  const duration = options.duration ?? 0.7;
  if (!elements.length) return;
  timeline.set(elements, { transition: 'none' }, position);
  timeline.from(
    elements,
    { y: options.y, opacity: 0, duration, ease: SOFT, stagger, immediateRender: true },
    position,
  );
  timeline.from(
    elements,
    {
      rotation: (index: number) => (options.swing === null ? 0 : (index % 2 ? 1 : -1) * options.swing),
      duration,
      ease: PIN_ROTATION_EASE,
      stagger,
      immediateRender: true,
      onComplete() {
        const targets = this.targets() as Element[];
        gsap.set(targets, { clearProps: options.keepTransform ? 'opacity,visibility,transition' : CLEAR });
      },
    },
    position,
  );
}

function hideUntilSplit(elements: HTMLElement[]) {
  if (elements.length) gsap.set(elements, { opacity: 0 });
}

/**
 * Line reveal from a mask (SplitText `lines`, Kap. 7.1). Must run after
 * `document.fonts.ready`, otherwise the lines are measured with the fallback
 * font. After the reveal the split is reverted, so the original markup (and
 * its natural line breaking on resize) is back.
 */
function splitLines(element: HTMLElement, build: (lines: Element[], done: () => void) => gsap.core.Animation) {
  // Soft hyphens (e.g. “Ferien&shy;wohnungen”) cannot break inside split words: fade instead.
  if ((element.textContent ?? '').includes(SOFT_HYPHEN)) return null;
  const label = accessibleText(element);
  // Undo hideUntilSplit without leaving an inline opacity behind.
  gsap.set(element, { clearProps: 'opacity,visibility' });
  const split = SplitText.create(element, {
    type: 'lines',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true,
    onSplit(self) {
      element.setAttribute('aria-label', label);
      return build(self.lines, () => self.revert());
    },
  });
  return split;
}

function textReveal(element: HTMLElement, start = 'top 85%') {
  const split = splitLines(element, (lines, done) =>
    gsap.from(lines, {
      yPercent: 110,
      duration: 0.8,
      ease: STRONG,
      stagger: 0.1,
      scrollTrigger: enter(element, start),
      onComplete: done,
    }),
  );
  if (!split) {
    gsap.fromTo(
      element,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: SOFT, clearProps: CLEAR, scrollTrigger: enter(element, start) },
    );
  }
}

function signReveal(element: HTMLElement, c: MotionConditions, start = 'top 88%') {
  const isLink = element.matches('a');
  if (isLink && !c.mobile) {
    // Soll: signpost links “fold out” from their left edge.
    gsap.from(element, {
      rotation: -4,
      opacity: 0,
      transformOrigin: 'left center',
      transition: 'none',
      duration: 0.5,
      ease: 'back.out(1.6)',
      clearProps: CLEAR,
      scrollTrigger: enter(element, start),
    });
    return;
  }
  if (isLink) {
    gsap.from(element, { opacity: 0, duration: 0.5, ease: SOFT, clearProps: CLEAR, scrollTrigger: enter(element, start) });
    return;
  }
  gsap.fromTo(
    element,
    { clipPath: 'inset(0% 100% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: SOFT, clearProps: CLEAR, scrollTrigger: enter(element, start) },
  );
}

function fadeReveal(element: HTMLElement, start = 'top 90%') {
  gsap.from(element, {
    opacity: 0,
    y: 16,
    duration: 0.6,
    ease: SOFT,
    clearProps: CLEAR,
    scrollTrigger: enter(element, start),
  });
}

function stampTween(timeline: gsap.core.Timeline, element: Element, position: number | string) {
  timeline.from(
    element,
    { scale: 0.6, opacity: 0, duration: 0.35, ease: 'back.out(2)', immediateRender: true, clearProps: CLEAR },
    position,
  );
}

/** Clip reveal for frameless images (strips, menu photo): curtain from the bottom, image settles. */
function clipBatch(elements: HTMLElement[], c: MotionConditions) {
  if (!elements.length) return;
  const images = elements.map((element) => element.querySelector('img')).filter((image): image is HTMLImageElement => !!image);
  gsap.set(elements, { clipPath: 'inset(0% 0% 100% 0%)' });
  if (images.length) gsap.set(images, { scale: 1.12 });
  ScrollTrigger.batch(elements, {
    start: reachableStart(0.85),
    onEnter: (entered) => {
      // No `once` (see enter()); elements that already played are skipped.
      const batch = entered.filter((element) => !revealed.has(element));
      if (!batch.length) return;
      batch.forEach((element) => revealed.add(element));
      const inner = batch.map((element) => element.querySelector('img')).filter(Boolean);
      const duration = c.mobile ? 0.8 : 1;
      gsap.to(batch, { clipPath: 'inset(0% 0% 0% 0%)', duration, ease: STRONG, stagger: 0.08, clearProps: CLEAR });
      gsap.to(inner, { scale: 1, duration, ease: STRONG, stagger: 0.08, clearProps: CLEAR });
    },
  });
}

function counterReveal(element: HTMLElement) {
  const tween = countUp(element, { paused: true });
  if (!tween) return;
  ScrollTrigger.create({ ...enter(element, 'top 85%'), onEnter: () => tween.play() });
  return () => stopCounter(element);
}

/** Collage parallax (Soll, ≥ 1024 px with fine pointer only): prints drift against each other. */
function parallax(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('.collage').forEach((collage) => {
    const prints = collage.querySelectorAll<HTMLElement>('[data-parallax]');
    prints.forEach((print, index) => {
      const direction = index % 2 ? -1 : 1;
      gsap.fromTo(
        print,
        { yPercent: 6 * direction },
        {
          yPercent: -6 * direction,
          ease: 'none',
          scrollTrigger: { trigger: collage, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        },
      );
    });
  });
}

/** Picture strip (Soll, desktop only): slight shift bound to the vertical scroll. */
function stripShift(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-strip-track]').forEach((track) => {
    const items = track.querySelectorAll<HTMLElement>(':scope > *');
    gsap.fromTo(
      items,
      { x: 32 },
      { x: -32, ease: 'none', scrollTrigger: { trigger: track, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
    );
  });
}

/**
 * Home hero (Storyboard `neu-motion-storyboard-hero.png`, ≤ 1.6 s, mobile
 * ≤ 1.2 s): label wipes in, contour panel rises, H1 lines from the mask,
 * prints land with ±8° (mobile ±4°), copy fades in, stamp pops. Runs on mount
 * (no ScrollTrigger) and waits for the fonts before splitting the H1.
 */
function heroIntro(hero: HTMLElement, c: MotionConditions, context: gsap.Context, isAlive: () => boolean) {
  const label = hero.querySelector<HTMLElement>('[data-reveal="sign"]');
  const title = hero.querySelector<HTMLElement>('h1[data-reveal="text"]');
  const panel = hero.querySelector<HTMLElement>('[data-reveal="panel"]');
  const prints = [...hero.querySelectorAll<HTMLElement>('[data-reveal="pin"]')];
  const stamp = hero.querySelector<HTMLElement>('[data-reveal="stamp"]');
  const fades = [...hero.querySelectorAll<HTMLElement>('[data-reveal="fade"]')];
  const all = [label, title, panel, stamp, ...prints, ...fades].filter((element): element is HTMLElement => !!element);

  // Hidden until the fonts are ready: index.html preloads the hero fonts, so
  // this is short; fontsReady() gives up after 1.5 s and the entry plays anyway.
  gsap.set(all, { opacity: 0 });

  void fontsReady().then(() => {
    if (!isAlive()) return;
    context.add(() => {
      gsap.set(all, { clearProps: 'opacity,visibility' });
      const timeline = gsap.timeline({
        defaults: { immediateRender: true },
        onComplete: () => {
          heroPlayed = true;
        },
      });
      if (label) {
        timeline.fromTo(
          label,
          { clipPath: 'inset(0% 100% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.35, ease: SOFT, clearProps: CLEAR },
          0,
        );
      }
      if (panel) timeline.from(panel, { y: 70, opacity: 0, duration: 0.6, ease: SOFT, clearProps: CLEAR }, 0);
      if (title) {
        const split = title.textContent?.includes(SOFT_HYPHEN)
          ? null
          : SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
        if (split) {
          title.setAttribute('aria-label', accessibleText(title));
          timeline.from(split.lines, { yPercent: 110, duration: 0.9, ease: STRONG, stagger: 0.12 }, 0.1);
          // Back to the original markup once the lines have landed.
          timeline.eventCallback('onComplete', () => {
            heroPlayed = true;
            split.revert();
          });
        } else {
          timeline.from(title, { opacity: 0, y: 24, duration: 0.7, ease: SOFT, clearProps: CLEAR }, 0.1);
        }
      }
      fades.forEach((element, index) => {
        timeline.from(element, { opacity: 0, y: 16, duration: 0.6, ease: SOFT, clearProps: CLEAR }, index === 0 ? 0.1 : 0.55 + index * 0.08);
      });
      pinTweens(timeline, prints, 0.4, 0.14, {
        y: c.mobile ? 40 : 70,
        swing: c.mobile ? 4 : 8,
        keepTransform: c.parallax,
      });
      if (stamp) stampTween(timeline, stamp, 1.25);
      if (c.mobile) timeline.timeScale(1.6 / 1.2);
    });
  });
}

/**
 * Scans `root` (the `main` element) for the motion hooks of the static
 * layout and wires them up. Returns a cleanup for state that a context
 * revert cannot undo (counter overlays).
 */
export function setupPageMotion(root: HTMLElement, c: MotionConditions, context: gsap.Context) {
  if (!c.motion) return undefined;
  let alive = true;
  const isAlive = () => alive;
  const cleanups: (() => void)[] = [];
  const skip = new Set<Element>();

  const hero = root.querySelector<HTMLElement>('.hero');
  settleShown(
    context,
    [...root.querySelectorAll(MOTION_TARGETS)].filter(
      (element) =>
        revealed.has(element) ||
        revealed.has(element.parentElement?.closest('[data-reveal="clip"]') ?? element) ||
        (heroPlayed && !!hero?.contains(element)),
    ),
  );
  if (hero) {
    hero.querySelectorAll('[data-reveal]').forEach((element) => skip.add(element));
    if (!heroPlayed) heroIntro(hero, c, context, isAlive);
  }
  // Gallery tiles and the Lightbox have their own motion (GalleryMasonry).
  root.querySelectorAll('[data-reveal="tile"]').forEach((element) => skip.add(element));

  // Groups: prints (and a stamp) of one collage land one after another.
  pending(root.querySelectorAll<HTMLElement>('[data-reveal="stagger"]'), skip).forEach((group) => {
    const prints = pending(group.querySelectorAll<HTMLElement>('[data-reveal="pin"]'), skip);
    const stamp = group.querySelector<HTMLElement>('[data-reveal="stamp"]');
    if (!prints.length && !stamp) return;
    prints.forEach((element) => skip.add(element));
    if (stamp) skip.add(stamp);
    const timeline = gsap.timeline({ scrollTrigger: enter(group, 'top 80%', stamp ? [...prints, stamp] : prints) });
    pinTweens(timeline, prints, 0, c.mobile ? 0.1 : 0.14, {
      y: c.mobile ? 24 : 40,
      swing: null,
      keepTransform: c.parallax,
    });
    if (stamp && !revealed.has(stamp)) stampTween(timeline, stamp, '>-0.2');
  });

  pending(root.querySelectorAll<HTMLElement>('[data-reveal="pin"]'), skip).forEach((element) => {
    const timeline = gsap.timeline({ scrollTrigger: enter(element, 'top 80%') });
    pinTweens(timeline, [element], 0, 0, { y: c.mobile ? 24 : 40, swing: null, keepTransform: false });
  });

  pending(root.querySelectorAll<HTMLElement>('[data-reveal="stamp"]'), skip).forEach((element) => {
    stampTween(gsap.timeline({ scrollTrigger: enter(element, 'top 85%') }), element, 0);
  });

  pending(root.querySelectorAll<HTMLElement>('[data-reveal="panel"]'), skip).forEach((element) => {
    gsap.from(element, { y: 40, opacity: 0, duration: 0.8, ease: SOFT, clearProps: CLEAR, scrollTrigger: enter(element, 'top 85%') });
  });

  pending(root.querySelectorAll<HTMLElement>('[data-reveal="sign"]'), skip).forEach((element) => signReveal(element, c));
  pending(root.querySelectorAll<HTMLElement>('[data-reveal="fade"]'), skip).forEach((element) => fadeReveal(element));
  clipBatch(pending(root.querySelectorAll<HTMLElement>('[data-reveal="clip"]'), skip), c);

  const counters = pending(root.querySelectorAll<HTMLElement>('[data-counter]'), skip);
  counters.forEach((element) => {
    const cleanup = counterReveal(element);
    if (cleanup) cleanups.push(cleanup);
  });

  if (c.parallax) {
    parallax(root);
    stripShift(root);
  }

  // Headlines: split after the fonts are ready; hidden until then.
  const texts = pending(root.querySelectorAll<HTMLElement>('[data-reveal="text"]'), skip);
  hideUntilSplit(texts);
  void fontsReady().then(() => {
    if (!alive) return;
    context.add(() => {
      texts.forEach((element) => textReveal(element));
      remeasureScrollTriggers();
    });
  });

  return () => {
    alive = false;
    cleanups.forEach((cleanup) => cleanup());
  };
}
