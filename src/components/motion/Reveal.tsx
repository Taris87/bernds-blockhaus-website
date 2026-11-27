import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '../../hooks/useReducedMotion';
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !ref.current) return;
    const context = gsap.context(() => { gsap.fromTo(ref.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }); }, ref);
    return () => context.revert();
  }, [reduced]);
  return <div ref={ref}>{children}</div>;
}
