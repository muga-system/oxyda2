import { useMemo } from 'react';
import type { Family, Skill } from '../../../shared/domain/types';
import { useProgress } from './useProgress';
import { getFamilyStatus, getSkillProgress } from '../domain/progress';
import { formatDate } from '../../../shared/ui/format';
import { errorLabels } from '../../../shared/ui/labels';
import StorageNotice from '../../../components/react/StorageNotice';
import { getChallengeSlug } from '../../../content/challenges';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';

const masteryLabels = {
  unexplored: 'Sin evidencia',
  developing: 'En desarrollo',
  available: 'Disponible',
  solid: 'Sólido',
} as const;

const freshnessLabels = {
  fresh: 'Reciente',
  cooling: 'En descenso',
  oxidized: 'Oxidada',
} as const;

export default function ProgressMapIsland({
  families,
  skills,
}: {
  families: Family[];
  skills: Skill[];
}) {
  const { snapshot, ready, message } = useProgress();
  const progress = useMemo(
    () =>
      skills.map((skill) =>
        getSkillProgress(skill.id, snapshot.evidences, new Date()),
      ),
    [skills, snapshot.evidences],
  );
  return (
    <>
      <StorageNotice message={message} />
      {!ready && (
        <p className="loading-status" role="status">
          Leyendo tu progreso en este navegador…
        </p>
      )}
      {ready && snapshot.evidences.length === 0 && (
        <div className="map-intro">
          <h2>El mapa empieza con una situación.</h2>
          <p>
            Todavía no hay respuestas registradas. Podés recorrer un desafío
            guiado o probar ideas de las cinco familias.
          </p>
          <div className="answer-actions">
            <AnimatedArrowLink
              className="button button-primary"
              href={`/desafio/${getChallengeSlug('percentage-discount-compare')}`}
              reload
            >
              Resolver mi primer desafío
            </AnimatedArrowLink>
            <a className="text-link" href="/prueba">
              Poneme a prueba
            </a>
            <a className="text-link" href="/desafio">
              Ver todos los desafíos
            </a>
          </div>
        </div>
      )}
      <div className="map-legend">
        <p>
          <strong>Comprensión y frescura son distintas.</strong> Una idea sólida
          puede necesitar un repaso. El tiempo no borra lo que aprendiste.
        </p>
        <span className="status status-refresh">↻ Para refrescar</span>
      </div>
      <div className="map-families">
        {families.map((family, familyIndex) => {
          const familySkills = skills.filter(
            (skill) => skill.familyId === family.id,
          );
          const entries = progress.filter((entry) =>
            familySkills.some((skill) => skill.id === entry.skillId),
          );
          const status = getFamilyStatus(entries);
          return (
            <section key={family.id} className="map-family">
              <header>
                <div>
                  <span className="eyebrow">
                    Familia {String(familyIndex + 1).padStart(2, '0')}
                  </span>
                  <h2>{family.title}</h2>
                </div>
                <span
                  className={`status ${status === 'Para refrescar' ? 'status-refresh' : ''}`}
                >
                  {status}
                </span>
              </header>
              <ul className="skill-map-list">
                {familySkills.map((skill) => {
                  const entry = progress.find(
                    (item) => item.skillId === skill.id,
                  )!;
                  return (
                    <li key={skill.id}>
                      <div className="skill-map-name">
                        <h3>{skill.title}</h3>
                        {entry.lastPracticedAt && (
                          <p>
                            Última práctica: {formatDate(entry.lastPracticedAt)}
                          </p>
                        )}
                        {entry.recurringError && (
                          <p className="error-pattern">
                            Para revisar:{' '}
                            {errorLabels[entry.recurringError].toLowerCase()}.
                          </p>
                        )}
                      </div>
                      <div
                        className="skill-map-dimensions"
                        aria-label={`Dominio ${masteryLabels[entry.mastery]}; frescura ${freshnessLabels[entry.freshness]}`}
                      >
                        <span>
                          <small>Dominio</small>
                          <strong>{masteryLabels[entry.mastery]}</strong>
                        </span>
                        <span>
                          <small>Frescura</small>
                          <strong>{freshnessLabels[entry.freshness]}</strong>
                        </span>
                      </div>
                      <span
                        className={`status status-${entry.mastery} ${entry.status === 'Para refrescar' ? 'status-refresh' : ''}`}
                      >
                        {entry.status === 'Para refrescar' ? '↻ ' : ''}
                        {entry.status}
                      </span>
                      <AnimatedArrowLink
                        href={`/aprender/${family.slug}#${skill.id}`}
                        className="skill-map-link"
                        aria-label={`${entry.status === 'Para refrescar' ? 'Refrescar' : 'Explorar'} ${skill.title.toLowerCase()}`}
                      >
                        {entry.status === 'Para refrescar'
                          ? 'Refrescar'
                          : 'Explorar'}
                      </AnimatedArrowLink>
                    </li>
                  );
                })}
              </ul>
              <AnimatedArrowLink
                className="text-link"
                href={`/aprender/${family.slug}`}
              >
                Abrir {family.title.toLowerCase()}
              </AnimatedArrowLink>
            </section>
          );
        })}
      </div>
      <p className="small-note">
        Tu mapa reúne prácticas recientes, pistas y reintentos. Solo se conserva
        en este navegador; borrar sus datos también borra este progreso.
      </p>
    </>
  );
}
