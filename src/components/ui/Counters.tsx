interface Counter {
  value: string;
  label: string;
}

/**
 * Numbers instead of a large photo (pattern M4). The DOM always holds the end
 * value; the motion layer may count up a visual duplicate
 * (`data-counter` carries the end value).
 */
export function Counters({ items, className = '' }: { items: Counter[]; className?: string }) {
  return (
    <dl className={`counters ${className}`.trim()}>
      {items.map((item) => (
        <div className="counter" key={item.label}>
          {/* dt first for valid markup; CSS shows the number on top. */}
          <dt className="counter-label">{item.label}</dt>
          <dd className="counter-value" data-counter={item.value}>
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
