import { useEffect, useRef, type RefObject } from 'react';
import { gsap } from './gsap';
import { useMotion } from './useMotion';

/**
 * Ticker loop (Kap. 7.1 “Laufband”): the track holds the facts twice and
 * moves by half its width, endlessly and linearly (40 s, mobile 30 s).
 *
 * It stops while the pause button is pressed (`paused`, WCAG 2.2.2), while
 * the pointer rests on or focus is inside the moving band, and while the band
 * is outside the viewport. With reduced motion no tween exists at all – the
 * CSS shows a static, wrapping list.
 */
export function useMarqueeMotion(root: RefObject<HTMLElement | null>, paused: boolean) {
  const pausedRef = useRef(paused);
  const sync = useRef<() => void>(() => undefined);

  useMotion(
    (conditions) => {
      const element = root.current;
      const viewport = element?.querySelector<HTMLElement>('.marquee-viewport');
      const track = element?.querySelector<HTMLElement>('[data-marquee-track]');
      if (!conditions.motion || !element || !viewport || !track) return;

      const tween = gsap.to(track, {
        xPercent: -50,
        duration: conditions.mobile ? 30 : 40,
        ease: 'none',
        repeat: -1,
        paused: true,
      });
      let hovered = false;
      let focused = false;
      let visible = true;

      const update = () => {
        const stop = pausedRef.current || hovered || focused || !visible;
        if (stop) tween.pause();
        else tween.play();
      };
      const onEnter = () => {
        hovered = true;
        update();
      };
      const onLeave = () => {
        hovered = false;
        update();
      };
      const onFocusIn = () => {
        focused = true;
        update();
      };
      const onFocusOut = (event: FocusEvent) => {
        focused = event.relatedTarget instanceof Node && viewport.contains(event.relatedTarget);
        update();
      };
      viewport.addEventListener('pointerenter', onEnter);
      viewport.addEventListener('pointerleave', onLeave);
      viewport.addEventListener('focusin', onFocusIn);
      viewport.addEventListener('focusout', onFocusOut);

      let observer: IntersectionObserver | undefined;
      if (typeof IntersectionObserver === 'function') {
        observer = new IntersectionObserver(([entry]) => {
          visible = !!entry?.isIntersecting;
          update();
        });
        observer.observe(element);
      }

      sync.current = update;
      update();
      return () => {
        sync.current = () => undefined;
        observer?.disconnect();
        viewport.removeEventListener('pointerenter', onEnter);
        viewport.removeEventListener('pointerleave', onLeave);
        viewport.removeEventListener('focusin', onFocusIn);
        viewport.removeEventListener('focusout', onFocusOut);
      };
    },
    { scope: root },
  );

  useEffect(() => {
    pausedRef.current = paused;
    sync.current();
  }, [paused]);
}
