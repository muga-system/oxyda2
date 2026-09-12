import { useMemo } from 'react';
import type { Challenge, Family, Skill } from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import { getSkillProgress } from '../../progress/domain/progress';
import ActionCard from '../../../components/react/ActionCard';
import StorageNotice from '../../../components/react/StorageNotice';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';

function HomeHeroArt() {
  return (
    <figure className="home-hero__art" aria-hidden="true">
      <img
        src="/hero/hero.png"
        width="1536"
        height="1024"
        alt=""
        decoding="async"
        fetchPriority="high"
      />
    </figure>
  );
}

function HomeDoors() {
  return (
    <section className="home-doors" aria-labelledby="doors-title">
      <header className="home-doors__header">
        <div>
          <span className="home-eyebrow">CINCO FORMAS DE SEGUIR</span>
          <h2 id="doors-title">Elegí por dónde seguir.</h2>
        </div>
        <span className="home-doors__index" aria-hidden="true">
          02—06
        </span>
      </header>
      <div className="action-grid">
        <ActionCard
          href="/aprender"
          title="Aprender"
          description="Ideas breves para comprender una relación y ponerla en práctica."
          icon="book-open"
          layout="compact"
        />
        <ActionCard
          href="/recordar"
          title="Recordar"
          description="La explicación que necesitás, cuando la necesitás."
          icon="search"
          layout="compact"
        />
        <ActionCard
          href="/prueba"
          title="Poneme a prueba"
          description="Ocho situaciones para reconocer qué ideas tenés a mano."
          icon="scan-line"
          layout="compact"
        />
        <ActionCard
          href="/mapa"
          title="Mi mapa"
          description="Lo que vas comprendiendo y lo que conviene refrescar."
          icon="map"
          layout="compact"
        />
        <ActionCard
          href="/desafio"
          title="Desafíos"
          description="Situaciones abiertas para poner una relación en juego."
          icon="compass"
          layout="compact"
        />
      </div>
    </section>
  );
}

export default function FirstRunIsland({
  challenges,
  families,
  skills,
}: {
  challenges: Challenge[];
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

  if (!ready)
    return (
      <div className="home-loading" aria-busy="true">
        <span className="sr-only">Leyendo tu progreso…</span>
      </div>
    );

  if (!snapshot.onboardingCompleted)
    return (
      <>
        <StorageNotice message={message} />
        <section className="home-hero home-hero--first-run">
          <div className="home-hero__copy">
            <span className="home-eyebrow">MATEMÁTICA COTIDIANA</span>
            <h1>
              Matemática para pensar,
              <br />
              <em>no solamente para calcular.</em>
            </h1>
            <p className="lead">
              Recuperá conocimientos que alguna vez aprendiste y dejaste de
              usar.
            </p>
            <p className="home-hero__support">
              Empezá con una situación cotidiana. Mirá qué hay detrás de los
              números y tomá una decisión con sentido.
            </p>
            <div className="home-hero__actions">
              <AnimatedArrowLink
                className="button button-primary"
                href="/desafio/comparar-descuentos"
                reload
              >
                Resolver mi primer desafío
              </AnimatedArrowLink>
              <AnimatedArrowLink
                className="home-text-action"
                href="#como-funciona"
                direction="down"
              >
                Explorar cómo funciona
              </AnimatedArrowLink>
              <AnimatedArrowLink className="home-text-action" href="/desafio">
                Ver todos los desafíos
              </AnimatedArrowLink>
            </div>
            <p className="small-note">Sin registro. Sin reloj. A tu ritmo.</p>
          </div>
          <HomeHeroArt />
        </section>
        <section
          className="home-method"
          id="como-funciona"
          aria-labelledby="method-title"
        >
          <div className="home-method__intro">
            <span className="home-eyebrow">CÓMO TRABAJAMOS</span>
            <h2 id="method-title">Pensar antes de calcular.</h2>
          </div>
          <div className="home-method__steps">
            <span>01 Reconocer</span>
            <span>02 Estimar</span>
            <span>03 Resolver</span>
            <span>04 Verificar</span>
            <span>05 Decidir</span>
          </div>
        </section>
      </>
    );

  return (
    <>
      <StorageNotice message={message} />
      <section className="home-hero home-hero--returning">
        <div className="home-hero__copy">
          <span className="home-eyebrow">TU ESPACIO DE PRÁCTICA</span>
          <h1>
            Volvé a poner
            <br />
            <em>las ideas en juego.</em>
          </h1>
          <p className="lead">
            Elegí una situación, una relación o una pregunta. Tu recorrido sigue
            disponible en este navegador.
          </p>
          <div className="home-hero__actions">
            <AnimatedArrowLink
              className="button button-primary"
              href={`/desafio/${featured.slug}`}
              reload
            >
              Resolver esta situación
            </AnimatedArrowLink>
            <AnimatedArrowLink
              className="button button-secondary"
              href="/mapa"
              direction="up-right"
            >
              Abrir mi mapa
            </AnimatedArrowLink>
          </div>
        </div>
        <HomeHeroArt />
      </section>
      <section className="home-focus" aria-labelledby="featured-title">
        <div className="home-focus__marker" aria-hidden="true">
          01
        </div>
        <div className="home-focus__body">
          <span className="home-eyebrow">DESAFÍO DESTACADO</span>
          <h2 id="featured-title">{featured.title}</h2>
          <p>{featured.scenario}</p>
          <AnimatedArrowLink
            className="button button-primary"
            href={`/desafio/${featured.slug}`}
            reload
          >
            Resolver esta situación
          </AnimatedArrowLink>
        </div>
        <div className="home-focus__aside">
          <span>Una relación cambia</span>
          <strong>una decisión.</strong>
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
          <AnimatedArrowLink
            className="button button-secondary"
            href={`/aprender/${refreshFamily.slug}#${refreshSkill.id}`}
          >
            Retomar la idea
          </AnimatedArrowLink>
        </aside>
      )}
      <section className="home-continue" aria-labelledby="continue-title">
        <div>
          <span className="home-eyebrow">CONTINUAR APRENDIZAJE</span>
          <h2 id="continue-title">{activeSkill.title}</h2>
          <p>{activeSkill.description}</p>
        </div>
        <AnimatedArrowLink
          className="home-text-action"
          href={`/aprender/${activeFamily.slug}#${activeSkill.id}`}
        >
          Abrir el concepto
        </AnimatedArrowLink>
      </section>
      <HomeDoors />
    </>
  );
}
