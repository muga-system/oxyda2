import { useReducedMotion } from 'motion/react';
import { useMemo, useRef } from 'react';
import type { Challenge, Family, Skill } from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import { getSkillProgress } from '../../progress/domain/progress';
import ActionCard from '../../../components/react/ActionCard';
import StorageNotice from '../../../components/react/StorageNotice';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';
import type { AnimatedIconHandle } from '../../../components/react/icons/animated-icon';
import { ArrowLeftRightIcon } from '../../../components/react/icons/arrow-left-right';

function MathInstrument({ label }: { label: string }) {
  const differenceIconRef = useRef<AnimatedIconHandle>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;

  function startDifferenceAnimation() {
    if (
      reducedMotion ||
      document.documentElement.dataset['reducedMotion'] === 'true'
    ) {
      differenceIconRef.current?.stopAnimation();
      return;
    }
    differenceIconRef.current?.startAnimation();
  }

  return (
    <aside
      className="math-instrument"
      aria-label="Comparación de descuentos"
      onMouseEnter={startDifferenceAnimation}
      onMouseLeave={() => differenceIconRef.current?.stopAnimation()}
    >
      <header className="math-instrument__header">
        <span>{label}</span>
        <span className="math-instrument__header-index">01 / 04</span>
      </header>
      <div className="math-instrument__steps">
        <div className="math-step">
          <span className="math-step__index">01</span>
          <div>
            <span className="math-step__label">Entrada</span>
            <strong>$80.000</strong>
            <small>precio original</small>
          </div>
        </div>
        <div className="math-step math-step--relation">
          <span className="math-step__index">02</span>
          <div>
            <span className="math-step__label">Relación</span>
            <strong>25%</strong>
            <small>descuento A</small>
          </div>
        </div>
        <div className="math-step math-step--operation">
          <span className="math-step__index">03</span>
          <div>
            <span className="math-step__label">Operación</span>
            <strong>80.000 × 0,25</strong>
            <small>parte del total</small>
          </div>
        </div>
        <div className="math-step math-step--result">
          <span className="math-step__index">04</span>
          <div>
            <span className="math-step__label">Resultado</span>
            <strong>$20.000</strong>
            <small>descuento A</small>
          </div>
        </div>
      </div>
      <div
        className="math-instrument__comparison"
        aria-label="Comparación de descuentos"
      >
        <header>
          <span>Comparación</span>
          <span>A ↔ B</span>
        </header>
        <div>
          <span>
            <b>A</b> descuento directo
          </span>
          <strong>$20.000</strong>
        </div>
        <div>
          <span>
            <b>B</b> oferta equivalente
          </span>
          <strong>$18.000</strong>
        </div>
        <div className="math-instrument__difference">
          <span>
            <ArrowLeftRightIcon
              ref={differenceIconRef}
              className="math-instrument__difference-icon"
              size={17}
              reducedMotion={reducedMotion}
            />
            diferencia
          </span>
          <strong>$2.000</strong>
        </div>
      </div>
      <p className="math-instrument__note">
        La misma unidad cambia la decisión.
      </p>
    </aside>
  );
}

function HomeDoors() {
  return (
    <section className="home-doors" aria-labelledby="doors-title">
      <header className="home-doors__header">
        <div>
          <span className="home-eyebrow">CUATRO FORMAS DE SEGUIR</span>
          <h2 id="doors-title">Elegí por dónde seguir.</h2>
        </div>
        <span className="home-doors__index" aria-hidden="true">
          02—05
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
      </div>
    </section>
  );
}

export default function FirstRunIsland({
  challenges,
  families,
  skills,
}: {
  challenges: Pick<Challenge, 'id' | 'slug' | 'title' | 'scenario'>[];
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
            </div>
            <p className="small-note">Sin registro. Sin reloj. A tu ritmo.</p>
          </div>
          <MathInstrument label="Una situación real" />
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
        <MathInstrument label="Relación a mano" />
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
