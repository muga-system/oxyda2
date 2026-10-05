import type { DisplayStatus, Mastery } from '../../shared/domain/types';

const statusModifiers: Record<DisplayStatus, string> = {
  Sólido: 'solid',
  Disponible: 'available',
  'En desarrollo': 'developing',
  'Para refrescar': 'refresh',
  'Sin explorar': 'unexplored',
};

const masteryLevels: Record<Mastery, number> = {
  unexplored: 0,
  developing: 1,
  available: 2,
  solid: 3,
};

/** Pill with a state dot. The text always carries the meaning. */
export function StatusChip({ status }: { status: DisplayStatus }) {
  return (
    <span className={`chip chip--${statusModifiers[status]}`}>
      <span className="chip__dot" aria-hidden="true" />
      {status}
    </span>
  );
}

/** Three-segment mastery meter. Decorative: pair it with visible text. */
export function MasteryMeter({
  mastery,
  refresh = false,
}: {
  mastery: Mastery;
  refresh?: boolean;
}) {
  const level = masteryLevels[mastery];
  return (
    <span
      className={`meter ${refresh ? 'meter--refresh' : ''}`}
      aria-hidden="true"
    >
      {[0, 1, 2].map((segment) => (
        <span key={segment} className={segment < level ? 'is-filled' : ''} />
      ))}
    </span>
  );
}
