import { useMemo } from 'react';
import type {
  DisplayStatus,
  Family,
  Freshness,
  Mastery,
  Skill,
} from '../../../shared/domain/types';
import { useProgress } from './useProgress';
import { getFamilyStatus, getSkillProgress } from '../domain/progress';
import { formatDate } from '../../../shared/ui/format';
import { errorLabels } from '../../../shared/ui/labels';
import { familyIllustrations } from '../../../shared/ui/illustrations';
import StorageNotice from '../../../components/react/StorageNotice';
import { MasteryMeter, StatusChip } from '../../../components/react/StatusChip';
import { getChallengeSlug } from '../../../content/challenges';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';

const masteryLabels: Record<Mastery, string> = {
  unexplored: 'Sin explorar',
  developing: 'En desarrollo',
  available: 'Disponible',
  solid: 'Sólido',
};

const freshnessLabels: Record<Freshness, string> = {
  fresh: 'Usada hace poco',
  cooling: 'Se está enfriando',
  oxidized: 'Sin uso reciente',
};

const masteryLegend: { mastery: Mastery; description: string }[] = [
  { mastery: 'unexplored', description: 'Todavía no hay respuestas.' },
  { mastery: 'developing', description: 'Hay evidencia; falta afianzarla.' },
  { mastery: 'available', description: 'Aparece bien en varias situaciones.' },
  { mastery: 'solid', description: 'Firme, también en casos más exigentes.' },
];

const totals: { label: string; statuses: DisplayStatus[] }[] = [
  { label: 'disponibles o sólidas', statuses: ['Disponible', 'Sólido'] },
  { label: 'en desarrollo', statuses: ['En desarrollo'] },
  { label: 'para refrescar', statuses: ['Para refrescar'] },
  { label: 'sin explorar', statuses: ['Sin explorar'] },
];

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
  const pattern = progress.find((entry) => entry.recurringError);
  const patternSkill = skills.find((skill) => skill.id === pattern?.skillId);
  const refresh = progress.find((entry) => entry.status === 'Para refrescar');
  const refreshSkill = skills.find((skill) => skill.id === refresh?.skillId);
  const refreshFamily = families.find(
    (family) => family.id === refreshSkill?.familyId,
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
        <section className="row" aria-labelledby="map-empty-title">
          <div className="cell cell--full map-empty">
            <span className="label">Todavía sin evidencia</span>
            <h2 id="map-empty-title">El mapa empieza con una situación.</h2>
            <p>
              Todavía no hay respuestas registradas. Podés recorrer un desafío
              guiado o hacer una primera lectura con Poneme a prueba.
            </p>
            <div className="actions">
              <AnimatedArrowLink
                className="button button-primary"
                href={`/desafio/${getChallengeSlug('percentage-discount-compare')}`}
                reload
              >
                Resolver mi primer desafío
              </AnimatedArrowLink>
              <a className="button button-secondary" href="/prueba">
                Poneme a prueba
              </a>
            </div>
          </div>
        </section>
      )}

      <div className="totals">
        <div className="totals__label">
          <span className="label">Resumen</span>
        </div>
        <dl aria-label="Resumen">
          {totals.map((total) => (
            <div
              className={`totals__cell ${total.statuses.includes('Para refrescar') ? 'is-refresh' : ''}`}
              key={total.label}
            >
              <dd>
                {
                  progress.filter((entry) =>
                    total.statuses.includes(entry.status),
                  ).length
                }
              </dd>
              <dt>{total.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <section className="map-legend" aria-labelledby="map-legend-title">
        <h2 className="sr-only" id="map-legend-title">
          Cómo leer el mapa
        </h2>
        <ul className="map-legend__items">
          <li
            className="map-legend__item is-refresh"
            title="Disponible o sólida, pero sin uso en el último mes."
          >
            <MasteryMeter mastery="solid" refresh />
            Para refrescar
          </li>
          {masteryLegend.map(({ mastery, description }) => (
            <li className="map-legend__item" key={mastery} title={description}>
              <MasteryMeter mastery={mastery} />
              {masteryLabels[mastery]}
            </li>
          ))}
        </ul>
      </section>

      {families.map((family) => {
        const familySkills = skills.filter(
          (skill) => skill.familyId === family.id,
        );
        const entries = progress.filter((entry) =>
          familySkills.some((skill) => skill.id === entry.skillId),
        );
        return (
          <section
            key={family.id}
            className="map-family"
            aria-labelledby={`map-${family.id}`}
          >
            <div className="map-family__head">
              <img
                src={familyIllustrations[family.id].src}
                width="52"
                height="52"
                alt=""
              />
              <div>
                <h2 id={`map-${family.id}`}>{family.title}</h2>
                <StatusChip status={getFamilyStatus(entries)} />
              </div>
            </div>
            <ul className="map-family__skills">
              {familySkills.map((skill) => {
                const entry = entries.find(
                  (item) => item.skillId === skill.id,
                )!;
                const isRefresh = entry.status === 'Para refrescar';
                return (
                  <li
                    key={skill.id}
                    className={`map-skill ${isRefresh ? 'is-refresh' : ''}`}
                  >
                    <a
                      href={`/aprender/${family.slug}#${skill.id}`}
                      aria-label={`${skill.title}: dominio ${masteryLabels[entry.mastery].toLowerCase()}${entry.mastery === 'unexplored' ? '' : `, frescura ${freshnessLabels[entry.freshness].toLowerCase()}`}`}
                    >
                      <span className="map-skill__name">{skill.title}</span>
                      <MasteryMeter
                        mastery={entry.mastery}
                        refresh={isRefresh}
                      />
                      <span className="map-skill__mastery">
                        {masteryLabels[entry.mastery]}
                      </span>
                      <span className="map-skill__fresh">
                        <span>
                          {entry.mastery === 'unexplored'
                            ? 'Sin evidencia'
                            : freshnessLabels[entry.freshness]}
                        </span>
                        {entry.lastPracticedAt && (
                          <span className="map-skill__date">
                            {formatDate(entry.lastPracticedAt)}
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {(patternSkill || refreshSkill) && (
        <section className="row" aria-labelledby="patterns-title">
          <div className="cell cell--intro">
            <span className="label">Patrones</span>
            <h2 id="patterns-title">Lo que dicen tus respuestas.</h2>
            <p>
              No se registra solo si acertaste: también qué tipo de error
              apareció.
            </p>
          </div>
          <div className="cell cell--wide cell--flush">
            {patternSkill && pattern?.recurringError && (
              <div className="pattern">
                <span className="tag">
                  {errorLabels[pattern.recurringError]}
                </span>
                <p>
                  En «{patternSkill.title}» aparece varias veces el mismo tipo
                  de error. Conviene volver a la idea antes de seguir
                  calculando.
                </p>
              </div>
            )}
            {refreshSkill && refreshFamily && (
              <div className="pattern pattern--next">
                <span>
                  <span className="pattern__hint">Próximo paso sugerido</span>
                  <strong>Refrescar «{refreshSkill.title}»</strong>
                </span>
                <AnimatedArrowLink
                  className="button button-primary"
                  href={`/aprender/${refreshFamily.slug}#${refreshSkill.id}`}
                >
                  Empezar
                </AnimatedArrowLink>
              </div>
            )}
          </div>
        </section>
      )}

      <p className="small-note page-note">
        Sin cuenta: tu progreso se guarda solo en este navegador. El mapa reúne
        prácticas recientes, pistas y reintentos; borrar los datos del navegador
        también borra este progreso.
      </p>
    </>
  );
}
