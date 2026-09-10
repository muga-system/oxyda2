import { useEffect, useRef, useState } from 'react';
import type {
  Challenge,
  EvidenceSource,
  Skill,
} from '../../../shared/domain/types';
import { makeEvidences } from '../application/attempts';
import { useProgress } from '../../progress/ui/useProgress';
import StepPanel, { type AttemptResult } from './StepPanel';
import ChallengeContext from '../../../components/react/ChallengeContext';
import StorageNotice from '../../../components/react/StorageNotice';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';
import ChallengeScene from './ChallengeScene';
import { runViewTransition } from '../../../shared/ui/viewTransition';

export default function ChallengeRunnerIsland({
  challenge,
  skills,
}: {
  challenge: Challenge;
  skills: Skill[];
}) {
  const { ready, message, record, complete } = useProgress();
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [source, setSource] = useState<EvidenceSource>('challenge');
  const session = useRef('');
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const step = challenge.steps[stepIndex];
  const firstChallenge = challenge.id === 'percentage-discount-compare';

  useEffect(() => {
    session.current = crypto.randomUUID();
    const requestedSource = new URLSearchParams(window.location.search).get(
      'source',
    );
    if (requestedSource === 'learning' || requestedSource === 'recall')
      setSource(requestedSource);
  }, []);

  useEffect(() => {
    if (finished) resultHeading.current?.focus();
  }, [finished]);

  function evaluated(result: AttemptResult) {
    if (!step) return;
    record(
      makeEvidences(challenge, step, result, {
        sessionId: session.current,
        source,
        answeredAt: new Date().toISOString(),
        id: crypto.randomUUID(),
      }),
    );
  }

  function next() {
    runViewTransition(() => {
      if (stepIndex + 1 < challenge.steps.length) setStepIndex(stepIndex + 1);
      else {
        complete(challenge.id, firstChallenge);
        setFinished(true);
      }
    });
  }

  if (finished)
    return (
      <section
        className="challenge-complete"
        aria-labelledby="challenge-complete-title"
      >
        <StorageNotice message={message} />
        <header className="challenge-complete__header">
          <span className="completion-symbol" aria-hidden="true">
            ✓
          </span>
          <div>
            <p className="eyebrow">Desafío recorrido</p>
            <span className="challenge-complete__index">
              {String(challenge.steps.length).padStart(2, '0')} /{' '}
              {String(challenge.steps.length).padStart(2, '0')}
            </span>
          </div>
        </header>
        <div className="challenge-complete__body">
          <h2 tabIndex={-1} ref={resultHeading} id="challenge-complete-title">
            El número es una parte.
            <br />
            Entenderlo cambia la decisión.
          </h2>
          <p className="lead">{challenge.takeaway}</p>
          <div className="used-skills">
            <h3>Habilidades que pusiste en juego</h3>
            <ul>
              {skills
                .filter((skill) => challenge.skillIds.includes(skill.id))
                .map((skill) => (
                  <li key={skill.id}>{skill.title}</li>
                ))}
            </ul>
          </div>
          {firstChallenge && (
            <p>
              Podés seguir con otra situación, aprender una idea, consultar una
              relación o explorar tu mapa.
            </p>
          )}
          <div className="answer-actions">
            <AnimatedArrowLink className="button button-primary" href="/">
              {firstChallenge ? 'Conocer mi espacio' : 'Volver al inicio'}
            </AnimatedArrowLink>
            <a className="button button-secondary" href="/mapa">
              Ver mi mapa
            </a>
          </div>
        </div>
      </section>
    );

  return (
    <>
      <StorageNotice message={message} />
      <div className="challenge-runner">
        <section className="runner-main" aria-label="Resolver el paso actual">
          <div className="runner-meta">
            <span>
              {firstChallenge
                ? 'Tu primer desafío'
                : 'Una situación para pensar'}
            </span>
            <span>
              Paso {stepIndex + 1} de {challenge.steps.length}
            </span>
          </div>
          <div className="step-track" aria-hidden="true">
            {challenge.steps.map((item, index) => (
              <span
                key={item.id}
                className={index <= stepIndex ? 'is-current' : ''}
              />
            ))}
          </div>
          {firstChallenge && step && <ChallengeScene step={step} />}
          {step && (
            <StepPanel
              key={step.id}
              step={step}
              ready={ready}
              onEvaluated={evaluated}
              onNext={next}
              finalStep={stepIndex === challenge.steps.length - 1}
              focusOnMount={stepIndex > 0}
            />
          )}
        </section>
        {step && (
          <ChallengeContext
            challenge={challenge}
            activeStep={step}
            stepIndex={stepIndex}
            totalSteps={challenge.steps.length}
            variant="runner"
          />
        )}
      </div>
    </>
  );
}
