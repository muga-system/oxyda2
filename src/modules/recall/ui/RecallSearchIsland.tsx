import { useMemo, useState } from 'react';
import type { Family, RecallCard } from '../../../shared/domain/types';
import { SearchIcon } from '../../../components/react/icons/search';
import { ArrowRightIcon } from '../../../components/react/icons/arrow';

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export default function RecallSearchIsland({
  cards,
  families,
}: {
  cards: RecallCard[];
  families: Family[];
}) {
  const [query, setQuery] = useState('');
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
  const hasQuery = words.length > 0;
  return (
    <>
      <div className="recall-search">
        <label htmlFor="recall-search">¿Qué necesitás recuperar?</label>
        <div className="search-field__input">
          <SearchIcon size={22} className="search-icon" reducedMotion />
          <input
            type="search"
            id="recall-search"
            placeholder="Porcentaje, precio por unidad, mediana…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </div>
        <p>
          Consultá una relación, fórmula o procedimiento sin recorrer un curso
          completo.
        </p>
      </div>
      <div className="recall-list-heading">
        <span>{hasQuery ? 'Coincidencias' : 'Referencias rápidas'}</span>
        <span className="result-count" role="status" aria-live="polite">
          {results.length === 1
            ? '1 referencia'
            : `${results.length} referencias`}
        </span>
      </div>
      <div className="recall-list">
        {results.map((card, index) => (
          <details className="recall-card" key={card.id}>
            <summary>
              <span className="recall-card__index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="eyebrow">
                  {familyLabels.get(card.familyId)}
                </span>
                <strong>{card.question}</strong>
              </span>
              <span className="details-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="recall-body">
              <div className="recall-body__idea">
                <span className="recall-label">Idea</span>
                <p>{card.idea}</p>
              </div>
              <div className="recall-body__math">
                {card.formula && (
                  <div className="formula">
                    <span className="recall-label">Relación</span>
                    <code>{card.formula}</code>
                  </div>
                )}
                <div className="recall-example">
                  <span className="recall-label">Ejemplo</span>
                  <p>{card.example}</p>
                </div>
                <a
                  className="button button-secondary"
                  href={`/desafio/${card.challengeId}?source=recall`}
                >
                  Probar un ejemplo <ArrowRightIcon size={18} reducedMotion />
                </a>
              </div>
            </div>
          </details>
        ))}
      </div>
      {results.length === 0 && (
        <div className="empty-state">
          <h2>No encontramos esa relación.</h2>
          <p>Probá con una palabra más breve o buscá en todas las familias.</p>
          <button
            className="button button-secondary"
            onClick={() => {
              setQuery('');
            }}
          >
            Ver todas las referencias
          </button>
        </div>
      )}
    </>
  );
}
