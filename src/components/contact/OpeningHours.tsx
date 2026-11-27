import { openingHours } from '../../data/contacts';

export function OpeningHours() {
  return (
    <dl className="opening-hours">
      {openingHours.map((entry) => (
        <div key={entry.days}>
          <dt>{entry.days}</dt>
          <dd>{entry.time}</dd>
        </div>
      ))}
    </dl>
  );
}
