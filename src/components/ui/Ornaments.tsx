/** Decorative SVG ornaments of the design system (Kap. 3.4). Always aria-hidden. */

const contourPaths = [
  'M-20 120 C120 60 220 180 360 130 S620 40 820 110',
  'M-20 170 C140 110 230 230 370 180 S630 90 820 160',
  'M-20 225 C150 165 250 285 385 235 S640 150 820 215',
  'M-20 285 C170 230 270 345 400 300 S650 215 820 280',
  'M-20 350 C180 300 300 410 420 370 S660 290 820 350',
  'M-20 420 C190 375 320 470 440 440 S670 370 820 425',
  'M-20 495 C200 455 330 540 460 515 S680 455 820 505',
  'M-20 575 C210 540 350 615 480 595 S690 545 820 590',
  'M-20 660 C220 630 360 700 500 680 S700 640 820 680',
  'M-20 745 C230 720 380 785 520 770 S710 735 820 770',
];

/** Contour lines of a hiking map – also readable as wood grain. */
export function ContourLines({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`contours ${className}`.trim()}
      viewBox="0 0 800 800"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-contours
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {contourPaths.map((path) => (
          <path key={path} d={path} vectorEffect="non-scaling-stroke" />
        ))}
        <ellipse cx="560" cy="330" rx="60" ry="26" vectorEffect="non-scaling-stroke" />
        <ellipse cx="560" cy="330" rx="110" ry="52" vectorEffect="non-scaling-stroke" />
        <ellipse cx="560" cy="330" rx="165" ry="80" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

/** Oak leaf used as divider and list bullet (Eichwieserhof). */
export function OakLeaf({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`oak-leaf ${className}`.trim()}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M16 2c2 2 1.6 4 3.6 4.4 2 .4 3.4-1 4.6.6 1 1.4-.8 3 .4 4.4 1.2 1.4 3.4.6 3.6 2.4.2 1.8-2.4 2.4-2 4.2.4 1.6 2.6 2 2 3.6-.6 1.6-3 .6-4 2-1 1.2.2 3.2-1.4 3.8-1.8.6-2.6-1.6-4.4-1.2-1 .2-1.4 1.6-2 2.8v3h-1v-3c-.6-1.2-1-2.6-2-2.8-1.8-.4-2.6 1.8-4.4 1.2-1.6-.6-.4-2.6-1.4-3.8-1-1.4-3.4-.4-4-2-.6-1.6 1.6-2 2-3.6.4-1.8-2.2-2.4-2-4.2.2-1.8 2.4-1 3.6-2.4 1.2-1.4-.6-3 .4-4.4 1.2-1.6 2.6-.2 4.6-.6C14.4 6 14 4 16 2z"
      />
    </svg>
  );
}
