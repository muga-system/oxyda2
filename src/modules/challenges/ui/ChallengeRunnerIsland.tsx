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
    if (stepIndex + 1 < challenge.steps.length) setStepIndex(stepIndex + 1);
    else {
      complete(challenge.id, firstChallenge);
      setFinished(true);
    }
  }

  if (finished)
    return (
      <div className="challenge-complete">
        <StorageNotice message={message} />
        <span className="completion-symbol" aria-hidden="true">
          ✓
        </span>
        <p className="eyebrow">Desafío recorrido</p>
        <h2 tabIndex={-1} ref={resultHeading}>
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
          <a className="button button-primary" href="/">
            {firstChallenge ? 'Conocer mi espacio' : 'Volver al inicio'}{' '}
            <span aria-hidden="true">→</span>
          </a>
          <a className="button button-secondary" href="/mapa">
            Ver mi mapa
          </a>
        </div>
      </div>
    );

  return (
    <>
      <StorageNotice message={message} />
      <div className="runner-meta">
        <span>
          {firstChallenge ? 'Tu primer desafío' : 'Una situación para pensar'}
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
      <ChallengeContext challenge={challenge} />
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
    </>
  );
}
