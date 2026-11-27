import type { ReactNode } from 'react';
import { ContourLines } from './Ornaments';

export type CollagePreset = 'hero' | 'pair' | 'pair-mirrored' | 'duo' | 'panorama';

interface Props {
  preset: CollagePreset;
  /** `PhotoPrint`s with `slot="slot-a"`, `slot-b`, … plus an optional `Stamp`. */
  children: ReactNode;
  /** Sandstone panel with contour lines behind the prints (hero pattern M1). */
  panel?: boolean;
  className?: string;
}

/**
 * Collage (“Hüttenwand”, M1/M2/M4/M5): prints placed absolutely inside a box
 * with a fixed aspect ratio. Positions are percentages per preset and
 * breakpoint (see `index.css`), so the box can shrink to 320 px without
 * overflow and prints are never wider than their photos.
 */
export function Collage({ preset, children, panel = false, className = '' }: Props) {
  return (
    <div className={['collage', `collage-${preset}`, className].filter(Boolean).join(' ')}>
      {panel && (
        <div className="collage-panel" aria-hidden="true" data-reveal="panel">
          <ContourLines />
        </div>
      )}
      <div className="collage-stage" data-reveal="stagger">
        {children}
      </div>
    </div>
  );
}

/** Round yellow stamp (“bis 60 – Plätze für Ihre Feier”). */
export function Stamp({ value, label }: { value: string; label: string }) {
  return (
    <p className="stamp" data-reveal="stamp">
      <span>
        <b>{value}</b> {label}
      </span>
    </p>
  );
}
