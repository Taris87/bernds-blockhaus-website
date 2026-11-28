import type { ReactNode } from 'react';
import { Link } from 'react-router';

type Variant = 'sign' | 'raps' | 'ivory';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  /** Arrow points right (forward) or left (back). */
  direction?: 'right' | 'left';
  className?: string;
}

type Props = BaseProps & ({ to: string; href?: never } | { href: string; to?: never } | { to?: never; href?: never });

/**
 * Signpost label (“Wegweiser”, Kap. 3.4): green arrow-shaped label used as
 * eyebrow (span) or as link. Motion: `data-reveal="sign"` (clip reveal).
 */
export function Sign({ children, variant = 'sign', direction = 'right', className = '', to, href }: Props) {
  const classes = ['sign', `sign-${variant}`, direction === 'left' ? 'sign-left' : '', className]
    .filter(Boolean)
    .join(' ');
  if (to !== undefined) {
    return (
      <Link className={`${classes} sign-link`} to={to} data-reveal="sign">
        {children}
      </Link>
    );
  }
  if (href !== undefined) {
    return (
      <a className={`${classes} sign-link`} href={href} data-reveal="sign">
        {children}
      </a>
    );
  }
  return (
    <span className={classes} data-reveal="sign">
      {children}
    </span>
  );
}
