import { useMemo } from 'react';
import type { Challenge, Freshness, Skill } from '../../../shared/domain/types';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';
import { useProgress } from '../../progress/ui/useProgress';
import { getSkillProgress } from '../../progress/domain/progress';
import { formatDate } from '../../../shared/ui/format';

const freshnessLabels: Record<Freshness, string> = {
  fresh: 'Práctica reciente',
  cooling: 'Conviene volver',
  oxidized: 'Necesita una revisión',
};

export default function FamilyConceptsIsland({
  familyTitle,
  skills,
  challenges,
}: {
  familyTitle: string;
  skills: Skill[];
  challenges: Challenge[];
}) {
  const { snapshot } = useProgress();
  const progress = useMemo(
    () =>
      skills.map((skill) =>
        getSkillProgress(skill.id, snapshot.evidences, new Date()),
      ),
    [skills, snapshot.evidences],
  );

  return (
    <>
      <nav
        className="concept-nav"
        aria-label={`Conceptos de ${familyTitle.toLowerCase()}`}
      >
        {skills.map((skill, index) => (
          <a href={`#${skill.id}`} key={skill.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {skill.title}
          </a>
        ))}
      </nav>
      <div className="microconcepts">
        {skills.map((skill, index) => {
          const entry = progress.find((item) => item.skillId === skill.id)!;
          const challenge =
            challenges.find((item) => item.skillIds.includes(skill.id)) ??
            challenges[0];
          const freshnessLabel =
            entry.mastery === 'unexplored'
              ? 'Todavía sin práctica'
              : freshnessLabels[entry.freshness];
          const statusClass = `status-${entry.mastery}${
            entry.status === 'Para refrescar' ? ' status-refresh' : ''
          }`;

          return (
            <article
              className="microconcept"
              id={skill.id}
              key={skill.id}
              aria-labelledby={`${skill.id}-title`}
            >
              <header className="microconcept-header">
                <span className="microconcept-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="microconcept-title">
                  <h2 id={`${skill.id}-title`}>{skill.title}</h2>
                  <p className="concept-description">{skill.description}</p>
                </div>
              </header>
              <div
                className="concept-state"
                aria-label={`Estado: ${entry.status}. ${freshnessLabel}`}
              >
                <span className={`status ${statusClass}`}>{entry.status}</span>
                <span>{freshnessLabel}</span>
                {entry.lastPracticedAt && (
                  <span>
                    Última práctica: {formatDate(entry.lastPracticedAt)}
                  </span>
                )}
              </div>
              <p className="concept-idea">{skill.idea}</p>
              <div className="concept-example">
                <span>Una relación posible</span>
                <p>{skill.example}</p>
              </div>
              {challenge && (
                <AnimatedArrowLink
                  className="button button-secondary concept-practice"
                  href={`/desafio/${challenge.slug}?source=learning`}
                >
                  Poner la idea en práctica
                </AnimatedArrowLink>
              )}
            </article>
          );
        })}
      </div>
      <p className="small-note concept-progress-note">
        La progresión orienta el recorrido, pero todos los conceptos están
        abiertos.
      </p>
    </>
  );
}
