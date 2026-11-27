import { useRef, useState, type KeyboardEvent } from 'react';
import type { MenuCategory, Photo as PhotoData } from '../../types/content';
import { Photo } from '../ui/Photo';

interface Props {
  categories: MenuCategory[];
  /** Optional dish photo per category id, shown beside the list on wide screens. */
  photos?: Partial<Record<string, PhotoData>>;
}

export function MenuTabs({ categories, photos = {} }: Props) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = Math.max(
    0,
    categories.findIndex((category) => category.id === activeId),
  );
  const category = categories[activeIndex];

  function selectIndex(index: number) {
    const next = categories[index];
    if (!next) return;
    setActiveId(next.id);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = categories.length - 1;
    const keyTargets: Record<string, number> = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    const target = keyTargets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    selectIndex(target);
  }

  if (!category) return null;
  const photo = photos[category.id];

  return (
    <div className="menu-board">
      <div
        className="menu-tabs"
        role="tablist"
        aria-label="Speisekarten-Kategorien"
      >
        {categories.map((item, index) => {
          const selected = item.id === category.id;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`menu-tab-${item.id}`}
              aria-selected={selected}
              aria-controls="menu-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={handleKeyDown}
            >
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>
      <div
        className="menu-list"
        role="tabpanel"
        id="menu-panel"
        aria-labelledby={`menu-tab-${category.id}`}
        tabIndex={0}
      >
        <h3>{category.title}</h3>
        {category.note && <p className="menu-note">{category.note}</p>}
        <ul className="menu-items">
          {category.items.map((item) => (
            <li className="menu-item" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
      {photo && (
        <div className="menu-photo" data-reveal="clip" key={category.id}>
          <Photo photo={photo} />
        </div>
      )}
    </div>
  );
}
