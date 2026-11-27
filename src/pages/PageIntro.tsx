import type { ReactNode } from 'react';
import { ContourLines } from '../components/ui/Ornaments';
import { Sign } from '../components/ui/Sign';

interface Props {
  eyebrow: string;
  title: ReactNode;
  copy?: ReactNode;
  /** Print or collage beside the type (desktop) / below it (mobile). */
  aside?: ReactNode;
  /** Extra content below the copy (facts, opening hours, …). */
  children?: ReactNode;
  className?: string;
}

/**
 * Page intro as type field (pattern M8): large display type over contour
 * lines; where a photo fits it sits beside the type as a print.
 */
export function PageIntro({ eyebrow, title, copy, aside, children, className = '' }: Props) {
  return (
    <section className={`page-intro${aside ? ' page-intro-split' : ''} ${className}`.trim()}>
      <ContourLines className="page-intro-contours" />
      <div className="wrap page-intro-grid">
        <div className="page-intro-copy">
          <Sign>{eyebrow}</Sign>
          <h1 data-reveal="text">{title}</h1>
          {copy && (
            <p className="lead" data-reveal="fade">
              {copy}
            </p>
          )}
          {children}
        </div>
        {aside && <div className="page-intro-aside">{aside}</div>}
      </div>
    </section>
  );
}
