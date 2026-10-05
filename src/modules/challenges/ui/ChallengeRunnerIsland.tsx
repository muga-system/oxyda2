import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type {
  Challenge,
  EvidenceSource,
  Skill,
} from '../../../shared/domain/types';
import { families } from '../../../content/skills';
import { makeEvidences } from '../application/attempts';
import { useProgress } from '../../progress/ui/useProgress';
import StepPanel, { type AttemptResult } from './StepPanel';
import ChallengeContext from '../../../components/react/ChallengeContext';
import StorageNotice from '../../../components/react/StorageNotice';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';
import { runViewTransition } from '../../../shared/ui/viewTransition';
import { kindLabels } from '../../../shared/ui/labels';
import { familyIllustrations } from '../../../shared/ui/illustrations';
import { BookmarkCheckIcon } from '../../../components/react/icons/bookmark-check';

type ChallengeStatus = 'pending' | 'active' | 'completed';

const statusLabels: Record<ChallengeStatus, string> = {
  pending: 'Disponible',
  active: 'Activo',
  completed: 'Completado',
};

function ScenarioText({ text }: { text: string }) {
  const question = '¿Cuál conviene?';
  const questionIndex = text.indexOf(question);

  if (questionIndex < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, questionIndex)}
      <strong className="runner__question">{question}</strong>
      {text.slice(questionIndex + question.length)}
    </>
  );
}

function CompletedIcon() {
  const reducedMotion = useReducedMotion() === true;
  return (
    <span className="challenge-index__done" aria-hidden="true">
      <BookmarkCheckIcon size={18} reducedMotion={reducedMotion} />
    </span>
  );
}

function StageLog({
  challenge,
  stepIndex,
}: {
  challenge: Challenge;
  stepIndex: number;
}) {
  return (
    <section className="runner__block" aria-labelledby="stage-log-title">
      <h2 className="label" id="stage-log-title">
        Registro
      </h2>
      <ol className="log__list">
        {challenge.steps.map((step, index) => {
          const state =
            index < stepIndex ? 'done' : index === stepIndex ? 'current' : '';
          return (
            <li
              key={step.id}
              className={`log__row ${state ? `is-${state}` : ''}`}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span className="log__mark" aria-hidden="true">
                {state === 'done' ? '✓' : state === 'current' ? '●' : '○'}
              </span>
              <span className="log__step">
                {step.label ?? kindLabels[step.kind]}
              </span>
              <span className="log__note">
                {state === 'done'
                  ? 'Resuelta.'
                  : state === 'current'
                    ? 'En curso.'
                    : 'Pendiente.'}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function ChallengeRunnerIsland({
  challenge,
  challenges,
  skills,
}: {
  challenge: Challenge;
  challenges: Challenge[];
  skills: Skill[];
}) {
  const { snapshot, ready, message, record, complete } = useProgress();
  const [currentId, setCurrentId] = useState(challenge.id);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [source, setSource] = useState<EvidenceSource>('challenge');
  const session = useRef('');
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const indexMenu = useRef<HTMLDetailsElement>(null);
  const currentChallenge =
    challenges.find((item) => item.id === currentId) ?? challenge;
  const step = currentChallenge.steps[stepIndex];
  const currentFamily = families.find(
    (family) => family.id === currentChallenge.familyId,
  );

  useEffect(() => {
    setCompletedIds(new Set(snapshot.completedChallengeIds));
  }, [snapshot.completedChallengeIds]);

  useEffect(() => {
    const requestedSource = new URLSearchParams(window.location.search).get(
      'source',
    );
    if (requestedSource === 'learning' || requestedSource === 'recall')
      setSource(requestedSource);
  }, []);

  useEffect(() => {
    session.current = crypto.randomUUID();
  }, [currentId]);

  useEffect(() => {
    if (finished) resultHeading.current?.focus({ preventScroll: true });
  }, [finished]);

  const filteredSkills = useMemo(
    () =>
      skills.filter((skill) => currentChallenge.skillIds.includes(skill.id)),
    [currentChallenge.skillIds, skills],
  );

  function evaluated(result: AttemptResult) {
    if (!step) return;
    record(
      makeEvidences(currentChallenge, step, result, {
        sessionId: session.current,
        source,
        answeredAt: new Date().toISOString(),
        id: crypto.randomUUID(),
      }),
    );
  }

  function statusFor(item: Challenge): ChallengeStatus {
    if (completedIds.has(item.id)) return 'completed';
    if (item.id === currentId) return 'active';
    return 'pending';
  }

  function show(target: Challenge) {
    setCurrentId(target.id);
    setStepIndex(0);
    setFinished(false);
    window.history.replaceState({}, '', `/desafio/${target.slug}`);
    document.title = `${target.title} · OxYda2`;
  }

  function selectChallenge(target: Challenge) {
    if (indexMenu.current) indexMenu.current.open = false;
    runViewTransition(() => show(target), { preserveWorkspaceScroll: false });
    window.scrollTo({ top: 0 });
  }

  function advanceToNext() {
    const completedNext = new Set(completedIds);
    completedNext.add(currentChallenge.id);
    setCompletedIds(completedNext);
    complete(
      currentChallenge.id,
      currentChallenge.id === 'percentage-discount-compare',
    );
    const nextChallenge = challenges.find(
      (item) => !completedNext.has(item.id),
    );
    if (!nextChallenge) {
      setFinished(true);
      return;
    }
    show(nextChallenge);
  }

  function next() {
    runViewTransition(
      () => {
        if (stepIndex + 1 < currentChallenge.steps.length)
          setStepIndex(stepIndex + 1);
        else advanceToNext();
      },
      {
        preserveWorkspaceScroll: stepIndex + 1 < currentChallenge.steps.length,
      },
    );
  }

  return (
    <div className="runner-page">
      <div className="runner-bar">
        <nav className="crumbs crumbs--inline" aria-label="Ruta">
          <a href="/desafio">Desafíos</a>
          <span aria-hidden="true">/</span>
          <span>{currentFamily?.title ?? 'Desafío'}</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{currentChallenge.title}</span>
        </nav>
        <details className="challenge-index" ref={indexMenu}>
          <summary
            aria-label={`Todos los desafíos, ${completedIds.size} de ${challenges.length} completados`}
          >
            Todos los desafíos
            <span className="challenge-index__count">
              {completedIds.size} / {challenges.length}
            </span>
          </summary>
          <div className="challenge-index__panel">
            {families.map((family) => (
              <section
                className="challenge-index__family"
                key={family.id}
                aria-labelledby={`index-${family.id}`}
              >
                <h3 id={`index-${family.id}`}>
                  <img
                    src={familyIllustrations[family.id].src}
                    width="18"
                    height="18"
                    alt=""
                  />
                  {family.title}
                </h3>
                <ol>
                  {challenges
                    .filter((item) => item.familyId === family.id)
                    .map((item) => {
                      const status = statusFor(item);
                      const number = String(
                        challenges.indexOf(item) + 1,
                      ).padStart(2, '0');
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            className={`challenge-index__item is-${status}`}
                            onClick={() => selectChallenge(item)}
                            aria-current={
                              item.id === currentId ? 'step' : undefined
                            }
                            aria-label={`${number} ${item.title}, ${statusLabels[status]}`}
                          >
                            <span className="challenge-index__number">
                              {number}
                            </span>
                            <span className="challenge-index__title">
                              {item.title}
                            </span>
                            {status === 'completed' ? (
                              <CompletedIcon />
                            ) : status === 'active' ? (
                              <span
                                className="challenge-index__active"
                                aria-hidden="true"
                              >
                                ●
                              </span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                </ol>
              </section>
            ))}
          </div>
        </details>
      </div>

      <StorageNotice message={message} />

      {finished ? (
        <section className="row" aria-labelledby="challenge-complete-title">
          <div className="cell cell--intro">
            <span className="label">
              Recorrido completo · {completedIds.size} / {challenges.length}
            </span>
            <h1 tabIndex={-1} ref={resultHeading} id="challenge-complete-title">
              Terminaste el recorrido. Las relaciones quedan a mano.
            </h1>
            <p className="lead">{currentChallenge.takeaway}</p>
            <div className="actions">
              <AnimatedArrowLink className="button button-primary" href="/">
                Volver al inicio
              </AnimatedArrowLink>
              <a className="button button-secondary" href="/mapa">
                Ver mi mapa
              </a>
            </div>
          </div>
          <div className="cell cell--wide">
            <h2 className="label">Habilidades que pusiste en juego</h2>
            <ul className="tags">
              {filteredSkills.map((skill) => (
                <li className="tag" key={skill.id}>
                  {skill.title}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <div className="runner challenge-shell">
          <aside className="runner__side" aria-label="Situación">
            <div className="runner__block">
              <span className="runner__family">
                <img
                  src={familyIllustrations[currentChallenge.familyId].src}
                  width="40"
                  height="40"
                  alt=""
                />
                <span className="label">Situación</span>
              </span>
              <h1 className="runner__title">{currentChallenge.title}</h1>
              <p className="runner__scenario">
                <ScenarioText text={currentChallenge.scenario} />
              </p>
              <ChallengeContext
                challenge={currentChallenge}
                activeStep={step}
                stepIndex={stepIndex}
                variant="runner"
              />
            </div>
            <StageLog challenge={currentChallenge} stepIndex={stepIndex} />
          </aside>
          {step && (
            <section
              className="runner__main dots challenge-workspace__inner"
              aria-label="Resolver el paso actual"
            >
              <StepPanel
                key={`${currentChallenge.id}-${step.id}`}
                step={step}
                stepLabel={`${String(stepIndex + 1).padStart(2, '0')} — ${step.label ?? kindLabels[step.kind]}`}
                ready={ready}
                onEvaluated={evaluated}
                onNext={next}
                finalStep={stepIndex === currentChallenge.steps.length - 1}
                focusOnMount={stepIndex > 0}
              />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
