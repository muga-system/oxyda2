import { useEffect, useRef, useState } from 'react';
import type { Evidence, Skill } from '../../../shared/domain/types';
import type { DiagnosticItem } from '../domain/selectDiagnostic';
import { makeEvidences } from '../../challenges/application/attempts';
import StepPanel, { type AttemptResult } from '../../challenges/ui/StepPanel';
import { useProgress } from '../../progress/ui/useProgress';
import ChallengeContext from '../../../components/react/ChallengeContext';
import StorageNotice from '../../../components/react/StorageNotice';
import { StatusChip } from '../../../components/react/StatusChip';
import { areaIllustrations } from '../../../shared/ui/illustrations';
import { runViewTransition } from '../../../shared/ui/viewTransition';
import {
  AnimatedArrowButton,
  AnimatedArrowLink,
} from '../../../components/react/AnimatedArrowAction';

type DiagnosticStatus =
  'Sólido' | 'Disponible' | 'En desarrollo' | 'Sin explorar';

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
    status: 'Sin explorar',
    description: 'Todavía no apareció evidencia en estas situaciones.',
  },
];

function getDiagnosticStatus(
  skillId: string,
  evidences: readonly Evidence[],
): DiagnosticStatus {
  const related = evidences.filter((evidence) => evidence.skillId === skillId);
  if (!related.length) return 'Sin explorar';
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
    if (started && !finished) {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const workspace = document.querySelector<HTMLElement>('.challenge-shell');
      const workspaceScrollTop = workspace?.scrollTop ?? 0;
      scenarioHeading.current?.focus({ preventScroll: true });
      window.scrollTo(scrollX, scrollY);
      if (workspace) workspace.scrollTop = workspaceScrollTop;
    }
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

  function next() {
    runViewTransition(() => {
      if (index + 1 === items.length) setFinished(true);
      else setIndex(index + 1);
    });
  }

  if (!started)
    return (
      <>
        <StorageNotice message={message} />
        <section className="row diagnostic-hero" aria-labelledby="h-diagnostic">
          <div className="cell diagnostic-hero__count dots">
            <span className="label">Poneme a prueba</span>
            <img
              src={areaIllustrations.diagnostic.src}
              width="120"
              height="134"
              alt=""
            />
            <p>
              <span className="diagnostic-hero__number">
                {String(items.length).padStart(2, '0')}
              </span>
              <span>situaciones breves.</span>
            </p>
          </div>
          <div className="cell cell--wide diagnostic-hero__copy">
            <h1 id="h-diagnostic">Una primera lectura de tus habilidades.</h1>
            <p className="lead">
              Vas a estimar, reconocer relaciones y revisar decisiones. No hace
              falta preparar nada.
            </p>
            <div className="actions">
              <AnimatedArrowButton
                className="button button-primary"
                disabled={!ready}
                onClick={() => setStarted(true)}
              >
                Empezar mi recorrido
              </AnimatedArrowButton>
              <span className="small-note">
                Si salís, la evidencia anterior se conserva.
              </span>
            </div>
          </div>
        </section>
        <div className="rules">
          <div className="rules__intro">
            <span className="label">Reglas</span>
            <h2>Cómo es la prueba.</h2>
          </div>
          <ul>
            <li>
              <span className="label">01</span>
              <strong>Una respuesta por situación.</strong>
              <span>Sin pistas previas: interesa cómo lo resolvés hoy.</span>
            </li>
            <li>
              <span className="label">02</span>
              <strong>«No sé todavía» es una respuesta.</strong>
              <span>Si una idea no aparece, decilo y seguí.</span>
            </li>
            <li>
              <span className="label">03</span>
              <strong>Sin nota ni reloj.</strong>
              <span>
                Las respuestas no se convierten en un puntaje: aportan a tu
                mapa.
              </span>
            </li>
          </ul>
        </div>
      </>
    );

  if (finished)
    return (
      <>
        <StorageNotice message={message} />
        <section className="row" aria-labelledby="diagnostic-results-title">
          <div className="cell cell--intro">
            <span className="label">Primera lectura creada</span>
            <h1 ref={resultHeading} tabIndex={-1} id="diagnostic-results-title">
              Una lectura, no una nota.
            </h1>
            <p className="lead">
              Esto orienta el próximo paso; una respuesta sola no define lo que
              sabés.
            </p>
            <div className="actions">
              <AnimatedArrowLink
                className="button button-primary"
                href="/mapa"
                direction="up-right"
              >
                Ver mi mapa
              </AnimatedArrowLink>
              <a className="button button-secondary" href="/">
                Volver al inicio
              </a>
            </div>
          </div>
          <div className="cell cell--wide cell--flush synthesis">
            {synthesisGroups.map((group) => {
              const groupSkills = skills.filter(
                (skill) =>
                  getDiagnosticStatus(skill.id, sessionEvidence) ===
                  group.status,
              );
              if (!groupSkills.length) return null;
              return (
                <section className="synthesis__group" key={group.status}>
                  <div className="synthesis__head">
                    <StatusChip status={group.status} />
                    <p>{group.description}</p>
                  </div>
                  <ul className="tags">
                    {groupSkills.map((skill) => (
                      <li className="tag" key={skill.id}>
                        {skill.title}
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>
      </>
    );

  return (
    <div className="runner diagnostic-shell challenge-shell">
      <StorageNotice message={message} />
      {current && (
        <>
          <aside className="runner__side" aria-label="Situación">
            <div className="runner__block">
              <span className="label" role="status" aria-live="polite">
                Diagnóstico · {String(index + 1).padStart(2, '0')} /{' '}
                {String(items.length).padStart(2, '0')}
              </span>
              <h2 ref={scenarioHeading} tabIndex={-1} className="runner__title">
                {current.challenge.title}
              </h2>
              <ChallengeContext challenge={current.challenge} />
            </div>
          </aside>
          <div className="runner__main dots">
            <div className="step-track" aria-hidden="true">
              {items.map((item, itemIndex) => (
                <span
                  key={item.step.id}
                  className={
                    itemIndex < index
                      ? 'is-done'
                      : itemIndex === index
                        ? 'is-current'
                        : ''
                  }
                />
              ))}
            </div>
            <StepPanel
              key={`${current.challenge.id}-${current.step.id}`}
              step={current.step}
              mode="diagnostic"
              ready={ready}
              onEvaluated={evaluated}
              onNext={next}
              finalStep={index + 1 === items.length}
            />
          </div>
        </>
      )}
    </div>
  );
}
