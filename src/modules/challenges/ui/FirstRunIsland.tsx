import { useMemo } from 'react';
import type { Challenge, Family, Skill } from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import { getSkillProgress } from '../../progress/domain/progress';
import ActionCard from '../../../components/react/ActionCard';
import StorageNotice from '../../../components/react/StorageNotice';

export default function FirstRunIsland({
  challenges,
  families,
  skills,
}: {
  challenges: Pick<Challenge, 'id' | 'title' | 'scenario'>[];
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
  const featured =
    challenges.find(
      (challenge) => !snapshot.completedChallengeIds.includes(challenge.id),
    ) ?? challenges[0]!;
  const refresh = progress.find((entry) => entry.status === 'Para refrescar');
  const refreshSkill = skills.find((skill) => skill.id === refresh?.skillId);
  const refreshFamily = families.find(
    (family) => family.id === refreshSkill?.familyId,
  );
  const activeSkill =
    skills.find((skill) =>
      progress.some(
        (entry) => entry.skillId === skill.id && entry.mastery === 'developing',
      ),
    ) ?? skills[0]!;
  const activeFamily = families.find(
    (family) => family.id === activeSkill.familyId,
  )!;

  if (!snapshot.onboardingCompleted)
    return (
      <>
        <StorageNotice message={message} />
        <div className="first-run">
          <div className="first-run-copy">
            <h1>
              Matemática para <em>pensar,</em>
              <br />
              no solamente
              <br />
              para calcular.
            </h1>
            <p className="lead">
              Hay ideas que no se olvidan.
              <br />
              Solo necesitan volver a usarse.
            </p>
            <p>
              Empezá con una situación cotidiana. Mirá qué hay detrás de los
              números y tomá una decisión con sentido.
            </p>
            <a
              className="button button-primary first-cta"
              href="/desafio/percentage-discount-compare"
            >
              Resolver mi primer desafío <span aria-hidden="true">→</span>
            </a>
            <p className="small-note">Sin registro. Sin reloj. A tu ritmo.</p>
          </div>
          <div
            className="first-run-preview"
            aria-label="Situación del primer desafío"
          >
            <div className="preview-heading">
              <span>Una campera. Dos ofertas.</span>
              <span className="preview-cross" aria-hidden="true">
                ×
              </span>
            </div>
            <div className="preview-price">
              <span>Precio original</span>
              <strong>$80.000</strong>
            </div>
            <div className="preview-offers">
              <div>
                <span>Tienda A</span>
                <strong>
                  25<span>%</span>
                </strong>
                <span>de descuento</span>
              </div>
              <div>
                <span>Tienda B</span>
                <strong>$18.000</strong>
                <span>de descuento</span>
              </div>
            </div>
            <p className="preview-question">
              ¿Cuál conviene?<span aria-hidden="true">↗</span>
            </p>
            <p className="preview-note">
              Antes de calcular,
              <br />
              hay algo para reconocer.
            </p>
          </div>
        </div>
        <div
          className="thinking-sequence"
          aria-label="Una forma de abordar cada situación"
        >
          <span>Reconocer</span>
          <span aria-hidden="true">→</span>
          <span>Estimar</span>
          <span aria-hidden="true">→</span>
          <span>Resolver</span>
          <span aria-hidden="true">→</span>
          <span>Verificar</span>
          <span aria-hidden="true">→</span>
          <span>Decidir</span>
        </div>
        {!ready && (
          <span className="sr-only" role="status">
            Leyendo tu progreso…
          </span>
        )}
      </>
    );

  return (
    <>
      <StorageNotice message={message} />
      <header className="home-heading">
        <h1>
          Volvé a poner
          <br />
          las ideas en juego.
        </h1>
        <a className="text-link" href="/mapa">
          Abrir mi mapa <span aria-hidden="true">↗</span>
        </a>
      </header>
      <section className="featured-challenge">
        <div>
          <p className="section-label">Desafío destacado</p>
          <h2>{featured.title}</h2>
          <p>{featured.scenario}</p>
          <a className="button button-primary" href={`/desafio/${featured.id}`}>
            Resolver esta situación <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="featured-aside">
          <span className="formula-mark" aria-hidden="true">
            O × Y = 2
          </span>
          <p>
            Reconocer una relación
            <br />
            también es hacer matemática.
          </p>
        </div>
      </section>
      {refreshSkill && refreshFamily && (
        <aside className="refresh-suggestion">
          <div>
            <span className="status status-refresh">↻ Para refrescar</span>
            <h2>{refreshSkill.title}</h2>
            <p>
              Hace un tiempo que no usás esta idea. Lo aprendido sigue en tu
              mapa.
            </p>
          </div>
          <a
            className="button button-secondary"
            href={`/aprender/${refreshFamily.slug}#${refreshSkill.id}`}
          >
            Retomar la idea <span aria-hidden="true">→</span>
          </a>
        </aside>
      )}
      <div className="continue-learning">
        <div>
          <span className="section-label">Continuar aprendizaje</span>
          <h2>{activeSkill.title}</h2>
          <p>{activeSkill.description}</p>
        </div>
        <a
          className="text-link"
          href={`/aprender/${activeFamily.slug}#${activeSkill.id}`}
        >
          Abrir el concepto <span aria-hidden="true">→</span>
        </a>
      </div>
      <section className="home-doors" aria-labelledby="doors-title">
        <h2 id="doors-title">Elegí por dónde seguir.</h2>
        <div className="action-grid">
          <ActionCard
            href="/aprender"
            title="Aprender"
            description="Ideas breves para comprender una relación y ponerla en práctica."
            icon="book-open"
          />
          <ActionCard
            href="/recordar"
            title="Recordar"
            description="La explicación que necesitás, cuando la necesitás."
            icon="search"
          />
          <ActionCard
            href="/prueba"
            title="Poneme a prueba"
            description="Ocho situaciones para reconocer qué ideas tenés a mano."
            icon="scan-line"
          />
          <ActionCard
            href="/mapa"
            title="Mi mapa"
            description="Lo que vas comprendiendo y lo que conviene refrescar."
            icon="map"
          />
        </div>
      </section>
    </>
  );
}
