import { useMemo, useState, type CSSProperties } from 'react';
import type { Family, RecallCard } from '../../../shared/domain/types';
import { SearchIcon } from '../../../components/react/icons/search';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';
import { getChallengeSlug } from '../../../content/challenges';
import { familyIllustrations } from '../../../shared/ui/illustrations';

function normalize(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function RecallDetail({
  card,
  familyTitle,
}: {
  card: RecallCard;
  familyTitle: string;
}) {
  return (
    <article
      className="recall-detail dots"
      id={`recall-${card.id}`}
      aria-labelledby={`recall-${card.id}-title`}
    >
      <header className="recall-detail__head">
        <img
          src={familyIllustrations[card.familyId].src}
          width="52"
          height="52"
          alt=""
        />
        <div>
          <span className="label">{familyTitle}</span>
          <h2 id={`recall-${card.id}-title`}>{card.question}</h2>
        </div>
      </header>
      <div className="recall-detail__body">
        <div className="recall-detail__block">
          <span className="label">Idea</span>
          <p>{card.idea}</p>
        </div>
        {card.formula && (
          <div className="recall-detail__block">
            <span className="label">Relación</span>
            <code>{card.formula}</code>
          </div>
        )}
        <div className="recall-detail__block recall-detail__block--example">
          <span className="label">Ejemplo</span>
          <p>{card.example}</p>
        </div>
      </div>
      <AnimatedArrowLink
        className="button button-primary"
        href={`/desafio/${getChallengeSlug(card.challengeId)}?source=recall`}
        reload
      >
        Probar un ejemplo
      </AnimatedArrowLink>
    </article>
  );
}

export default function RecallSearchIsland({
  cards,
  families,
}: {
  cards: RecallCard[];
  families: Family[];
}) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(cards[0]?.id ?? '');
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const familyLabels = useMemo(
    () => new Map(families.map((family) => [family.id, family.title])),
    [families],
  );
  const results = cards.filter((card) =>
    words.every((word) =>
      normalize(
        `${card.question} ${card.idea} ${card.formula ?? ''} ${card.keywords.join(' ')}`,
      ).includes(word),
    ),
  );
  const selected =
    results.find((card) => card.id === selectedId) ?? results[0] ?? null;

  return (
    <>
      <div className="recall-search">
        <label htmlFor="recall-search">¿Qué necesitás recuperar?</label>
        <div className="search-field">
          <SearchIcon size={18} className="search-field__icon" reducedMotion />
          <input
            type="search"
            id="recall-search"
            placeholder="Porcentaje, precio por unidad, mediana…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </div>
        <span className="result-count" role="status" aria-live="polite">
          {results.length === 1
            ? '1 referencia'
            : `${results.length} referencias`}
        </span>
      </div>
      {results.length > 0 ? (
        <ul
          className="recall-browser"
          style={{ '--recall-rows': results.length } as CSSProperties}
        >
          {results.map((card) => {
            const isSelected = card.id === selected?.id;
            return (
              <li key={card.id} className="recall-browser__item">
                <button
                  type="button"
                  className="recall-browser__option"
                  aria-pressed={isSelected}
                  aria-controls={isSelected ? `recall-${card.id}` : undefined}
                  onClick={() => setSelectedId(card.id)}
                >
                  <img
                    src={familyIllustrations[card.familyId].src}
                    width="22"
                    height="22"
                    alt=""
                  />
                  <span className="recall-browser__copy">
                    <strong>{card.question}</strong>
                    <span>{familyLabels.get(card.familyId)}</span>
                  </span>
                </button>
                {isSelected && (
                  <RecallDetail
                    card={card}
                    familyTitle={familyLabels.get(card.familyId) ?? ''}
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="empty-state">
          <h2>No encontramos esa relación.</h2>
          <p>Probá con una palabra más breve o buscá en todas las familias.</p>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setQuery('')}
          >
            Ver todas las referencias
          </button>
        </div>
      )}
    </>
  );
}
