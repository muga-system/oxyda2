import { useEffect, useRef, useState } from 'react';
import type { Evidence, Skill } from '../../../shared/domain/types';
import type { DiagnosticItem } from '../domain/selectDiagnostic';
import { makeEvidences } from '../../challenges/application/attempts';
import StepPanel, { type AttemptResult } from '../../challenges/ui/StepPanel';
import { useProgress } from '../../progress/ui/useProgress';
import ChallengeContext from '../../../components/react/ChallengeContext';
import StorageNotice from '../../../components/react/StorageNotice';
import {
  AnimatedArrowButton,
  AnimatedArrowLink,
} from '../../../components/react/AnimatedArrowAction';

type DiagnosticStatus =
  'Sólido' | 'Disponible' | 'En desarrollo' | 'Para explorar';

const synthesisGroups: {
  status: DiagnosticStatus;
  description: string;
}[] = [
  {
    status: 'Sólido',
    description: 'Apareció con una respuesta consistente en este recorrido.',
  },
  {
    status: 'Disponible',
    description: 'La idea apareció, aunque conviene volver a usarla.',
  },
  {
    status: 'En desarrollo',
    description: 'Hay una relación para revisar con más tiempo.',
  },
  {
    status: 'Para explorar',
    description: 'Todavía no apareció evidencia en estas situaciones.',
  },
];

function getDiagnosticStatus(
  skillId: string,
  evidences: readonly Evidence[],
): DiagnosticStatus {
  const related = evidences.filter((evidence) => evidence.skillId === skillId);
  if (!related.length) return 'Para explorar';
  if (related.every((evidence) => evidence.correct)) return 'Sólido';
  if (related.some((evidence) => evidence.correct)) return 'Disponible';
  return 'En desarrollo';
}

export default function DiagnosticRunnerIsland({
  items,
  skills,
}: {
  items: DiagnosticItem[];
  skills: Skill[];
}) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [sessionEvidence, setSessionEvidence] = useState<Evidence[]>([]);
  const sessionId = useRef('');
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const scenarioHeading = useRef<HTMLHeadingElement>(null);
  const { ready, message, record } = useProgress();
  const current = items[index];

  useEffect(() => {
    sessionId.current = crypto.randomUUID();
  }, []);
  useEffect(() => {
    if (finished) resultHeading.current?.focus();
  }, [finished]);
  useEffect(() => {
    if (started && !finished) scenarioHeading.current?.focus();
  }, [started, index, finished]);

  function evaluated(result: AttemptResult) {
    if (!current) return;
    const evidences = makeEvidences(current.challenge, current.step, result, {
      sessionId: sessionId.current,
      source: 'diagnostic',
      answeredAt: new Date().toISOString(),
      id: crypto.randomUUID(),
    });
    record(evidences);
    setSessionEvidence((previous) => [...previous, ...evidences]);
  }

  if (!started)
    return (
      <div className="diagnostic-intro">
        <StorageNotice message={message} />
        <div className="diagnostic-line">
          <span className="large-number">08</span>
          <p>
            situaciones breves.
            <br />
            <strong>Una primera lectura de tus habilidades.</strong>
          </p>
        </div>
        <p className="lead">
          Vas a estimar, reconocer relaciones y revisar decisiones. No hace
          falta preparar nada.
        </p>
        <ul className="plain-list">
          <li>Una respuesta por situación, sin pistas previas.</li>
          <li>Si una idea no aparece, podés decir «No sé todavía».</li>
          <li>Sin nota ni reloj. Las respuestas aportan a tu mapa.</li>
        </ul>
        <AnimatedArrowButton
          className="button button-primary"
          disabled={!ready}
          onClick={() => setStarted(true)}
        >
          Empezar mi recorrido
        </AnimatedArrowButton>
        <p className="small-note">
          Cada respuesta se guarda. Si salís, podés volver a empezar; la
          evidencia anterior se conserva.
        </p>
      </div>
    );

  if (finished)
    return (
      <section
        className="diagnostic-results"
        aria-labelledby="diagnostic-results-title"
      >
        <StorageNotice message={message} />
        <p className="eyebrow">Primera lectura creada</p>
        <h2 ref={resultHeading} tabIndex={-1} id="diagnostic-results-title">
          Ya tenemos suficiente evidencia para empezar a organizar tus
          habilidades.
        </h2>
        <p className="lead">
          Esto orienta el próximo paso; una respuesta sola no define lo que
          sabés.
        </p>
        <div className="diagnostic-synthesis">
          {synthesisGroups.map((group) => {
            const groupSkills = skills.filter(
              (skill) =>
                getDiagnosticStatus(skill.id, sessionEvidence) === group.status,
            );
            if (!groupSkills.length) return null;
            return (
              <section
                className="diagnostic-synthesis__group"
                key={group.status}
              >
                <div>
                  <h3>{group.status}</h3>
                  <p>{group.description}</p>
                </div>
                <ul>
                  {groupSkills.map((skill) => (
                    <li key={skill.id}>{skill.title}</li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        <div className="answer-actions">
          <AnimatedArrowLink
            className="button button-primary"
            href="/mapa"
            direction="up-right"
          >
            Ver mi mapa
          </AnimatedArrowLink>
          <AnimatedArrowLink className="button button-secondary" href="/">
            Volver al inicio
          </AnimatedArrowLink>
        </div>
      </section>
    );

  return (
    <>
      <StorageNotice message={message} />
      <div className="runner-meta" role="status" aria-live="polite">
        <span>Diagnóstico</span>
        <span>
          {String(index + 1).padStart(2, '0')} /{' '}
          {String(items.length).padStart(2, '0')}
        </span>
      </div>
      <div className="step-track" aria-hidden="true">
        {items.map((item, itemIndex) => (
          <span
            key={item.step.id}
            className={itemIndex <= index ? 'is-current' : ''}
          />
        ))}
      </div>
      {current && (
        <>
          <h2
            ref={scenarioHeading}
            tabIndex={-1}
            className="diagnostic-scenario-title"
          >
            {current.challenge.title}
          </h2>
          <ChallengeContext challenge={current.challenge} />
          <StepPanel
            key={`${current.challenge.id}-${current.step.id}`}
            step={current.step}
            mode="diagnostic"
            ready={ready}
            onEvaluated={evaluated}
            onNext={() => {
              if (index + 1 === items.length) setFinished(true);
              else setIndex(index + 1);
            }}
            finalStep={index + 1 === items.length}
          />
        </>
      )}
    </>
  );
}
