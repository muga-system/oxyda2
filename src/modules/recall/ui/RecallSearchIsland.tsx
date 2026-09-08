import { useState } from 'react';
import type { Family, RecallCard } from '../../../shared/domain/types';
import { SearchIcon } from '../../../components/react/icons/search';

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
  const [family, setFamily] = useState('all');
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const results = cards.filter(
    (card) =>
      (family === 'all' || card.familyId === family) &&
      words.every((word) =>
        normalize(
          `${card.question} ${card.idea} ${card.keywords.join(' ')}`,
        ).includes(word),
      ),
  );
  return (
    <>
      <div className="recall-controls">
        <div className="search-field">
          <label htmlFor="recall-search">¿Qué necesitás recordar?</label>
          <div>
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
        </div>
        <div className="family-filter">
          <label htmlFor="recall-family">Familia</label>
          <select
            id="recall-family"
            value={family}
            onChange={(event) => setFamily(event.target.value)}
          >
            <option value="all">Todas las familias</option>
            {families.map((item) => (
              <option value={item.id} key={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="result-count" role="status">
        {results.length === 1
          ? '1 referencia disponible'
          : `${results.length} referencias disponibles`}
      </p>
      <div className="recall-list">
        {results.map((card) => (
          <details className="recall-card" key={card.id}>
            <summary>
              <span>
                <span className="eyebrow">
                  {families.find((item) => item.id === card.familyId)?.title}
                </span>
                <strong>{card.question}</strong>
              </span>
              <span className="details-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="recall-body">
              <p>{card.idea}</p>
              {card.formula && <div className="formula">{card.formula}</div>}
              <p className="example-label">Por ejemplo</p>
              <p>{card.example}</p>
              <a
                className="button button-secondary"
                href={`/desafio/${card.challengeId}?source=recall`}
              >
                Probar un ejemplo <span aria-hidden="true">→</span>
              </a>
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
              setFamily('all');
            }}
          >
            Ver todas las referencias
          </button>
        </div>
      )}
    </>
  );
}
