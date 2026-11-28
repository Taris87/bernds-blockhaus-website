import { useEffect, useRef, type RefObject } from 'react';

export interface SwipeHandlers {
  /** -1 = swipe to the left (next), 1 = swipe to the right (previous). */
  onSwipe: (direction: -1 | 1) => void;
  /** Horizontal offset while the pointer is down (for a follow-the-finger effect). */
  onDrag?: (dx: number) => void;
  /** Pointer released or cancelled without a swipe. */
  onCancel?: () => void;
}

/** Minimum horizontal distance in px before a drag counts as a swipe. */
export const SWIPE_THRESHOLD = 50;

/**
 * Horizontal swipe on an element with Pointer Events (no package). A swipe
 * needs `SWIPE_THRESHOLD` px and must be clearly more horizontal than
 * vertical. Drags that start on a button or link are ignored.
 * `consumeSwipe()` lets a click handler ignore the click that ends a drag.
 */
export function useSwipe(target: RefObject<HTMLElement | null>, handlers: SwipeHandlers) {
  const handlersRef = useRef(handlers);
  const swiped = useRef(false);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    const element = target.current;
    if (!element) return;
    let start: { x: number; y: number; id: number } | null = null;
    let dragging = false;

    const down = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary) return;
      if (event.target instanceof Element && event.target.closest('button, a, input')) return;
      start = { x: event.clientX, y: event.clientY, id: event.pointerId };
      dragging = false;
      swiped.current = false;
    };
    const move = (event: PointerEvent) => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) dragging = true;
      if (dragging) handlersRef.current.onDrag?.(dx);
    };
    const up = (event: PointerEvent) => {
      if (!start || event.pointerId !== start.id) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      start = null;
      if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.2) {
        swiped.current = true;
        handlersRef.current.onSwipe(dx < 0 ? -1 : 1);
      } else if (dragging) {
        swiped.current = true;
        handlersRef.current.onCancel?.();
      }
      dragging = false;
    };
    const cancel = () => {
      if (start && dragging) handlersRef.current.onCancel?.();
      start = null;
      dragging = false;
    };

    // A mouse drag on the photo must not start the native image drag (that cancels the pointer).
    const noNativeDrag = (event: DragEvent) => event.preventDefault();
    element.addEventListener('dragstart', noNativeDrag);
    element.addEventListener('pointerdown', down);
    element.addEventListener('pointermove', move);
    element.addEventListener('pointerup', up);
    element.addEventListener('pointercancel', cancel);
    return () => {
      element.removeEventListener('dragstart', noNativeDrag);
      element.removeEventListener('pointerdown', down);
      element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerup', up);
      element.removeEventListener('pointercancel', cancel);
    };
  }, [target]);

  return {
    /** True once for the click that ends a swipe or drag; resets on read. */
    consumeSwipe() {
      const value = swiped.current;
      swiped.current = false;
      return value;
    },
  };
}
