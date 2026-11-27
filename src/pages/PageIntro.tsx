import type { ReactNode } from 'react';
interface Props { eyebrow: string; title: ReactNode; copy: string; }
export function PageIntro({ eyebrow, title, copy }: Props) {
  return <section className="page-intro"><div className="section-wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-intro-copy">{copy}</p></div></section>;
}
