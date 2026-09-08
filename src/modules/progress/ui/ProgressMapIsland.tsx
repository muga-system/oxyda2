import { useMemo } from 'react';
import type { Family, Skill } from '../../../shared/domain/types';
import { useProgress } from './useProgress';
import { getFamilyStatus, getSkillProgress } from '../domain/progress';
import { formatDate } from '../../../shared/ui/format';
import { errorLabels } from '../../../shared/ui/labels';
import StorageNotice from '../../../components/react/StorageNotice';

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
            <a
              className="button button-primary"
              href="/desafio/percentage-discount-compare"
            >
              Resolver mi primer desafío <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href="/prueba">
              Poneme a prueba
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
                      <span
                        className={`status status-${entry.mastery} ${entry.status === 'Para refrescar' ? 'status-refresh' : ''}`}
                      >
                        {entry.status === 'Para refrescar' ? '↻ ' : ''}
                        {entry.status}
                      </span>
                      <a
                        href={`/aprender/${family.slug}#${skill.id}`}
                        className="skill-map-link"
                        aria-label={`${entry.status === 'Para refrescar' ? 'Refrescar' : 'Explorar'} ${skill.title.toLowerCase()}`}
                      >
                        {entry.status === 'Para refrescar'
                          ? 'Refrescar'
                          : 'Explorar'}{' '}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
              <a className="text-link" href={`/aprender/${family.slug}`}>
                Abrir {family.title.toLowerCase()}{' '}
                <span aria-hidden="true">→</span>
              </a>
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
