import { openingHours } from '../../data/contacts';

interface Props {
  /** Heading level that fits the surrounding outline. */
  level?: 2 | 3;
  title?: string;
  className?: string;
}

/** Opening hours as a pinned board (Kap. 6 `OpeningHoursBoard`). */
export function OpeningHoursBoard({ level = 3, title = 'Öffnungszeiten der Gaststätte', className = '' }: Props) {
  const Heading = level === 2 ? 'h2' : 'h3';
  return (
    <div className={`hours-board ${className}`.trim()} data-reveal="fade">
      <Heading className="hours-board-title">{title}</Heading>
      <dl className="opening-hours">
        {openingHours.map((entry) => (
          <div key={entry.days}>
            <dt>{entry.days}</dt>
            <dd>{entry.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
