import { useMemo } from 'react';
import type {
  Challenge,
  Family,
  RecallCard,
  Skill,
  SkillProgress,
} from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import {
  getFamilyStatus,
  getSkillProgress,
} from '../../progress/domain/progress';
import { kindLabels } from '../../../shared/ui/labels';
import { familyIllustrations } from '../../../shared/ui/illustrations';
import ActionCard from '../../../components/react/ActionCard';
import StorageNotice from '../../../components/react/StorageNotice';
import { StatusChip } from '../../../components/react/StatusChip';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';

function HeroArt() {
  return (
    <figure className="hero__art dots" aria-hidden="true">
      <picture>
        <source
          type="image/webp"
          srcSet="/hero/hero-480.webp?v=2 480w, /hero/hero-768.webp?v=2 768w, /hero/hero-1200.webp?v=2 1200w"
          sizes="(max-width: 959px) 90vw, 440px"
        />
        <img
          src="/hero/hero.png"
          width="1536"
          height="1024"
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </picture>
    </figure>
  );
}

function ChallengeLog({ challenge }: { challenge: Challenge }) {
  const family = challenge.familyId;
  return (
    <div className="log">
      <div className="log__header">
        <span className="log__title">
          <img
            src={familyIllustrations[family].src}
            width="20"
            height="20"
            alt=""
          />
          {challenge.title}
        </span>
        <span className="log__meta">{challenge.steps.length} etapas</span>
      </div>
      <ol className="log__list">
        {challenge.steps.map((step, index) => (
          <li
            className={`log__row ${index === 0 ? 'is-current' : ''}`}
            key={step.id}
          >
            <span className="log__mark" aria-hidden="true">
              {index === 0 ? '●' : '○'}
            </span>
            <span className="log__step">
              {step.label ?? kindLabels[step.kind]}
            </span>
            <span className="log__note">{step.prompt}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FamilyGrid({
  families,
  skills,
  progress,
}: {
  families: Family[];
  skills: Skill[];
  progress: SkillProgress[];
}) {
  return (
    <section className="section" aria-labelledby="families-title">
      <div className="section__head">
        <div>
          <span className="label">03 — Familias</span>
          <h2 id="families-title">
            Cinco familias, {skills.length} habilidades.
          </h2>
        </div>
        <a className="text-link" href="/mapa">
          Abrir Mi mapa →
        </a>
      </div>
      <ul className="family-grid grid-cells grid-cells--pairs">
        {families.map((family, index) => {
          const familySkills = skills.filter(
            (skill) => skill.familyId === family.id,
          );
          const status = getFamilyStatus(
            progress.filter((entry) =>
              familySkills.some((skill) => skill.id === entry.skillId),
            ),
          );
          return (
            <li key={family.id}>
              <a className="family-cell" href={`/aprender/${family.slug}`}>
                <span className="family-cell__top">
                  <img
                    src={familyIllustrations[family.id].src}
                    width="64"
                    height="64"
                    alt=""
                  />
                  <span className="family-cell__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className="family-cell__body">
                  <span className="family-cell__title">{family.title}</span>
                  <StatusChip status={status} />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Doors() {
  return (
    <section className="section" aria-labelledby="doors-title">
      <div className="section__head">
        <div>
          <span className="label">Otras formas de entrar</span>
          <h2 id="doors-title">Elegí por dónde seguir.</h2>
        </div>
      </div>
      <div className="action-grid grid-cells grid-cells--pairs">
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
        <ActionCard
          href="/desafio"
          title="Desafíos"
          description="Situaciones abiertas para poner una relación en juego."
          icon="compass"
        />
      </div>
    </section>
  );
}

function RecallStrip({ cards }: { cards: RecallCard[] }) {
  return (
    <section className="row" aria-labelledby="recall-title">
      <div className="cell cell--intro">
        <span className="label">04 — Recordar</span>
        <h2 id="recall-title">La relación justa, cuando la necesitás.</h2>
        <a className="text-link" href="/recordar">
          Buscar una relación →
        </a>
      </div>
      <dl className="cell cell--wide relation-list">
        {cards.map((card) => (
          <div className="relation-list__row" key={card.id}>
            <dt>{card.question}</dt>
            {card.formula && <dd>{card.formula}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function FirstRunIsland({
  challenges,
  families,
  skills,
  recallCards,
}: {
  challenges: Challenge[];
  families: Family[];
  skills: Skill[];
  recallCards: RecallCard[];
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

  const firstRun = !snapshot.onboardingCompleted;
  const featuredHref = firstRun
    ? '/desafio/comparar-descuentos'
    : `/desafio/${featured.slug}`;

  return (
    <>
      <StorageNotice message={message} />
      <section className="row hero" aria-labelledby="hero-title">
        <span className="cross cross--bl" aria-hidden="true" />
        <span className="cross cross--br" aria-hidden="true" />
        <div className="cell hero__copy">
          <span className="label">
            {firstRun ? '01 — OxYda2' : '01 — Tu espacio de práctica'}
          </span>
          <h1 id="hero-title">
            {firstRun
              ? 'Matemática para pensar, no solamente para calcular.'
              : 'Volvé a poner las ideas en juego.'}
          </h1>
          <p className="lead">
            {firstRun
              ? 'Reconocé qué matemática hay en una situación, estimá antes de calcular y verificá si el resultado tiene sentido.'
              : 'Elegí una situación, una relación o una pregunta. Tu recorrido sigue disponible en este navegador.'}
          </p>
          <div className="actions">
            <AnimatedArrowLink
              className="button button-primary"
              href={featuredHref}
              reload
            >
              {firstRun
                ? 'Resolver mi primer desafío'
                : 'Seguir con un desafío'}
            </AnimatedArrowLink>
            <a
              className="button button-secondary"
              href={firstRun ? '/prueba' : '/mapa'}
            >
              {firstRun ? 'Poneme a prueba' : 'Abrir mi mapa'}
            </a>
          </div>
          {firstRun && (
            <p className="small-note">Sin registro. Sin reloj. A tu ritmo.</p>
          )}
        </div>
        <HeroArt />
      </section>

      <section className="row" aria-labelledby="log-title">
        <div className="cell cell--intro">
          <span className="label">
            {firstRun ? '02 — Cómo funciona' : '02 — Desafío destacado'}
          </span>
          <h2 id="log-title">
            {firstRun
              ? 'Cada desafío deja un registro de cómo lo pensaste.'
              : featured.title}
          </h2>
          <p>
            {firstRun
              ? 'No solo si acertaste: dónde dudaste, qué tipo de error apareció y qué conviene repasar.'
              : featured.scenario}
          </p>
          {!firstRun && (
            <AnimatedArrowLink className="text-link" href={featuredHref} reload>
              Resolver esta situación
            </AnimatedArrowLink>
          )}
        </div>
        <div className="cell cell--wide">
          <ChallengeLog challenge={featured} />
        </div>
      </section>

      {!firstRun && (
        <section className="row" aria-label="Para retomar">
          <div className="cell retake">
            <span className="label">Continuar aprendizaje</span>
            <h2>{activeSkill.title}</h2>
            <p>{activeSkill.description}</p>
            <AnimatedArrowLink
              className="text-link"
              href={`/aprender/${activeFamily.slug}#${activeSkill.id}`}
            >
              Abrir el concepto
            </AnimatedArrowLink>
          </div>
          {refreshSkill && refreshFamily && (
            <div className="cell retake">
              <StatusChip status="Para refrescar" />
              <h2>{refreshSkill.title}</h2>
              <p>
                Hace un tiempo que no usás esta idea. Lo aprendido sigue en tu
                mapa.
              </p>
              <AnimatedArrowLink
                className="text-link"
                href={`/aprender/${refreshFamily.slug}#${refreshSkill.id}`}
              >
                Retomar la idea
              </AnimatedArrowLink>
            </div>
          )}
        </section>
      )}

      <FamilyGrid families={families} skills={skills} progress={progress} />
      <RecallStrip cards={recallCards} />
      <Doors />
    </>
  );
}
