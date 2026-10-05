import { useMemo } from 'react';
import type { Challenge, Freshness, Skill } from '../../../shared/domain/types';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';
import { StatusChip } from '../../../components/react/StatusChip';
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
        <span className="concept-nav__label label" aria-hidden="true">
          Conceptos
        </span>
        {skills.map((skill, index) => (
          <a href={`#${skill.id}`} key={skill.id}>
            <span className="concept-nav__index">
              {String(index + 1).padStart(2, '0')}
            </span>
            {skill.title}
          </a>
        ))}
      </nav>
      <div>
        {skills.map((skill, index) => {
          const entry = progress.find((item) => item.skillId === skill.id)!;
          const challenge =
            challenges.find((item) => item.skillIds.includes(skill.id)) ??
            challenges[0];
          const freshnessLabel =
            entry.mastery === 'unexplored'
              ? 'Todavía sin práctica'
              : freshnessLabels[entry.freshness];

          return (
            <article
              className="concept"
              id={skill.id}
              key={skill.id}
              aria-labelledby={`${skill.id}-title`}
            >
              <div className="concept__meta">
                <header className="concept__top">
                  <span className="concept__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <StatusChip status={entry.status} />
                </header>
                <div className="concept__title">
                  <h2 id={`${skill.id}-title`}>{skill.title}</h2>
                  <p>{skill.description}</p>
                </div>
                <p className="concept__freshness">
                  {freshnessLabel}
                  {entry.lastPracticedAt &&
                    ` · Última práctica: ${formatDate(entry.lastPracticedAt)}`}
                </p>
                {challenge && (
                  <AnimatedArrowLink
                    className="button button-secondary button-small"
                    href={`/desafio/${challenge.slug}?source=learning`}
                    reload
                  >
                    Poner la idea en práctica
                  </AnimatedArrowLink>
                )}
              </div>
              <div className="concept__body">
                <span className="label">Idea</span>
                <p className="concept__idea">{skill.idea}</p>
                <p className="concept__example">{skill.example}</p>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
