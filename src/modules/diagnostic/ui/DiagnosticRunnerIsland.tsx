import { useEffect, useRef, useState } from 'react';
import type { Evidence, Family, Skill } from '../../../shared/domain/types';
import type { DiagnosticItem } from '../domain/selectDiagnostic';
import { makeEvidences } from '../../challenges/application/attempts';
import StepPanel, { type AttemptResult } from '../../challenges/ui/StepPanel';
import { useProgress } from '../../progress/ui/useProgress';
import ChallengeContext from '../../../components/react/ChallengeContext';
import StorageNotice from '../../../components/react/StorageNotice';
import { kindLabels } from '../../../shared/ui/labels';

export default function DiagnosticRunnerIsland({
  items,
  families,
  skills,
}: {
  items: DiagnosticItem[];
  families: Family[];
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
        <button
          className="button button-primary"
          disabled={!ready}
          onClick={() => setStarted(true)}
        >
          Empezar mi recorrido <span aria-hidden="true">→</span>
        </button>
        <p className="small-note">
          Cada respuesta se guarda. Si salís, podés volver a empezar; la
          evidencia anterior se conserva.
        </p>
      </div>
    );

  if (finished)
    return (
      <section className="diagnostic-results">
        <StorageNotice message={message} />
        <p className="eyebrow">Recorrido completo</p>
        <h2 ref={resultHeading} tabIndex={-1}>
          Una lectura, no una etiqueta.
        </h2>
        <p className="lead">
          Estas situaciones dan algunas pistas. Una respuesta sola no define lo
          que sabés.
        </p>
        <div className="diagnostic-family-list">
          {families.map((family) => {
            const familySkills = skills.filter(
              (skill) => skill.familyId === family.id,
            );
            const tested = familySkills.filter((skill) =>
              sessionEvidence.some((evidence) => evidence.skillId === skill.id),
            );
            return (
              <section className="diagnostic-family" key={family.id}>
                <h3>{family.title}</h3>
                {tested.map((skill) => {
                  const related = sessionEvidence.filter(
                    (evidence) => evidence.skillId === skill.id,
                  );
                  const successful = related.some(
                    (evidence) => evidence.correct,
                  );
                  const toReview = related.some(
                    (evidence) => !evidence.correct,
                  );
                  return (
                    <p key={skill.id}>
                      <strong>{skill.title}</strong>
                      <span>
                        {successful && toReview
                          ? 'La idea apareció; hay una relación para revisar.'
                          : successful
                            ? 'Pudiste usar esta idea en la situación.'
                            : 'Conviene retomar esta idea con un ejemplo.'}
                      </span>
                    </p>
                  );
                })}
                <a className="text-link" href={`/aprender/${family.slug}`}>
                  Retomar {family.title.toLowerCase()}{' '}
                  <span aria-hidden="true">↗</span>
                </a>
              </section>
            );
          })}
        </div>
        <div className="answer-actions">
          <a className="button button-primary" href="/mapa">
            Ver mi mapa <span aria-hidden="true">→</span>
          </a>
          <a className="button button-secondary" href="/aprender">
            Elegir qué aprender
          </a>
        </div>
      </section>
    );

  return (
    <>
      <StorageNotice message={message} />
      <div className="runner-meta">
        <span>{current ? kindLabels[current.step.kind] : 'Diagnóstico'}</span>
        <span>
          Situación {index + 1} de {items.length}
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
