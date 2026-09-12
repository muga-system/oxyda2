import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { useReducedMotion } from 'motion/react';
import type {
  Challenge,
  EvidenceSource,
  FamilyId,
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
import type { AnimatedIconHandle } from '../../../components/react/icons/animated-icon';
import { BookTextIcon } from '../../../components/react/icons/book-text';
import { BookmarkCheckIcon } from '../../../components/react/icons/bookmark-check';
import { ChevronsLeftRightIcon } from '../../../components/react/icons/chevrons-left-right';
import { CompassIcon } from '../../../components/react/icons/compass';
import { MapPinIcon } from '../../../components/react/icons/map-pin';
import { ScanTextIcon } from '../../../components/react/icons/scan-text';
import { SearchIcon } from '../../../components/react/icons/search';

type ChallengeStatus = 'pending' | 'active' | 'completed';

type FamiliesScrollbarState = {
  isScrollable: boolean;
  thumbOffset: number;
  thumbSize: number;
};

const statusLabels: Record<ChallengeStatus, string> = {
  pending: 'Disponible',
  active: 'Activo',
  completed: 'Completado',
};

function FamilyIcon({ familyId }: { familyId: FamilyId }) {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;
  const Icon =
    familyId === 'percentage'
      ? ScanTextIcon
      : familyId === 'proportion'
        ? ChevronsLeftRightIcon
        : familyId === 'estimation'
          ? CompassIcon
          : familyId === 'units'
            ? MapPinIcon
            : familyId === 'data'
              ? SearchIcon
              : BookTextIcon;

  function animate() {
    if (
      reducedMotion ||
      document.documentElement.dataset['reducedMotion'] === 'true'
    )
      return;
    iconRef.current?.startAnimation();
  }

  return (
    <span
      className="challenge-family__icon"
      onMouseEnter={animate}
      onFocus={animate}
      aria-hidden="true"
    >
      <Icon ref={iconRef} size={18} reducedMotion={reducedMotion} />
    </span>
  );
}

function CompletionStatusIcon() {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion === true;

  return (
    <span className="challenge-list__status-icon" aria-hidden="true">
      <BookmarkCheckIcon size={20} reducedMotion={reducedMotion} />
    </span>
  );
}

function ScenarioText({ text }: { text: string }) {
  const question = '¿Cuál conviene?';
  const questionIndex = text.indexOf(question);

  if (questionIndex < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, questionIndex)}
      <span className="workspace-header__question">{question}</span>
      {text.slice(questionIndex + question.length)}
    </>
  );
}

function getStatus(
  challenge: Challenge,
  currentId: string,
  completedIds: Set<string>,
): ChallengeStatus {
  if (completedIds.has(challenge.id)) return 'completed';
  if (challenge.id === currentId) return 'active';
  return 'pending';
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
  const workspaceContent = useRef<HTMLDivElement>(null);
  const currentChallenge =
    challenges.find((item) => item.id === currentId) ?? challenge;
  const step = currentChallenge.steps[stepIndex];
  const currentFamily = families.find(
    (family) => family.id === currentChallenge.familyId,
  );
  const [openFamilyId, setOpenFamilyId] = useState<FamilyId | null>(
    currentFamily?.id ?? families[0]?.id ?? null,
  );
  const familiesRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [familiesScrollbar, setFamiliesScrollbar] =
    useState<FamiliesScrollbarState>({
      isScrollable: false,
      thumbOffset: 0,
      thumbSize: 0,
    });

  useEffect(() => {
    setCompletedIds(new Set(snapshot.completedChallengeIds));
  }, [snapshot.completedChallengeIds]);

  useLayoutEffect(() => {
    setOpenFamilyId(currentFamily?.id ?? null);
  }, [challenge.id, currentChallenge.id, currentFamily?.id]);

  useLayoutEffect(() => {
    const element = familiesRef.current;
    const scrollbar = scrollbarRef.current;
    if (!element || !scrollbar) return;

    let frame = 0;
    const syncScrollbar = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollableDistance = element.scrollHeight - element.clientHeight;
        const isScrollable = scrollableDistance > 1;

        if (!isScrollable) {
          setFamiliesScrollbar({
            isScrollable: false,
            thumbOffset: 0,
            thumbSize: 0,
          });
          return;
        }

        const trackHeight = scrollbar.clientHeight;
        const thumbSize = Math.min(
          trackHeight,
          Math.max(
            40,
            (element.clientHeight / element.scrollHeight) * trackHeight,
          ),
        );
        const trackDistance = Math.max(0, trackHeight - thumbSize);
        const thumbOffset =
          (element.scrollTop / scrollableDistance) * trackDistance;

        setFamiliesScrollbar({ isScrollable: true, thumbOffset, thumbSize });
      });
    };

    const resizeObserver = new ResizeObserver(syncScrollbar);
    resizeObserver.observe(element);
    resizeObserver.observe(scrollbar);
    Array.from(element.children).forEach((child) =>
      resizeObserver.observe(child),
    );
    element.addEventListener('scroll', syncScrollbar, { passive: true });
    window.addEventListener('resize', syncScrollbar);
    syncScrollbar();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      element.removeEventListener('scroll', syncScrollbar);
      window.removeEventListener('resize', syncScrollbar);
    };
  }, [currentChallenge.id, openFamilyId]);

  useEffect(() => {
    if (!openFamilyId) return;

    const revealFamily = () => {
      const container = familiesRef.current;
      const family = container?.querySelector<HTMLElement>(
        `[data-family-id="${openFamilyId}"]`,
      );
      if (!container || !family) return;

      const containerRect = container.getBoundingClientRect();
      const familyRect = family.getBoundingClientRect();
      const familyTop =
        container.scrollTop + familyRect.top - containerRect.top;
      const familyBottom = familyTop + familyRect.height;
      const visibleTop = container.scrollTop;
      const visibleBottom = visibleTop + container.clientHeight;
      const maxScroll = Math.max(
        0,
        container.scrollHeight - container.clientHeight,
      );
      const targetScroll = Math.min(
        maxScroll,
        Math.max(
          0,
          familyBottom > visibleBottom
            ? familyBottom - container.clientHeight
            : familyTop < visibleTop
              ? familyTop
              : container.scrollTop,
        ),
      );

      if (Math.abs(targetScroll - container.scrollTop) < 1) return;
      container.scrollTo({
        top: targetScroll,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    };

    const frame = requestAnimationFrame(revealFamily);
    const settled = window.setTimeout(revealFamily, 340);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settled);
    };
  }, [openFamilyId]);

  useEffect(() => {
    session.current = crypto.randomUUID();
    const requestedSource = new URLSearchParams(window.location.search).get(
      'source',
    );
    if (requestedSource === 'learning' || requestedSource === 'recall')
      setSource(requestedSource);
  }, []);

  useLayoutEffect(() => {
    if (finished) return;
    const content = workspaceContent.current;
    const header = content?.querySelector<HTMLElement>('.step-panel__header');
    if (!content || !header) return;

    const syncHeaderHeight = () => {
      const headerRect = header.getBoundingClientRect();
      const headerMarginBottom = Number.parseFloat(
        getComputedStyle(header).marginBottom,
      );
      content.style.setProperty(
        '--runner-step-header-height',
        `${headerRect.height + (Number.isNaN(headerMarginBottom) ? 0 : headerMarginBottom)}px`,
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);

    return () => {
      observer.disconnect();
      content.style.removeProperty('--runner-step-header-height');
    };
  }, [currentChallenge.id, finished, step?.id]);

  useEffect(() => {
    session.current = crypto.randomUUID();
    const workspace = document.querySelector<HTMLElement>(
      '.challenge-workspace__inner',
    );
    if (workspace) {
      workspace.scrollTop = 0;
      requestAnimationFrame(() => {
        workspace.scrollTop = 0;
      });
    }
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

  function statusFor(id: string): ChallengeStatus {
    const target = challenges.find((item) => item.id === id);
    return target ? getStatus(target, currentId, completedIds) : 'pending';
  }

  function selectChallenge(id: string) {
    const target = challenges.find((item) => item.id === id);
    if (!target) return;
    runViewTransition(
      () => {
        setCurrentId(target.id);
        setStepIndex(0);
        setFinished(false);
        window.history.replaceState({}, '', `/desafio/${target.slug}`);
        document.title = `${target.title} · OxYda2`;
      },
      { preserveWorkspaceScroll: false },
    );
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
    setCurrentId(nextChallenge.id);
    setStepIndex(0);
    setFinished(false);
    window.history.replaceState({}, '', `/desafio/${nextChallenge.slug}`);
    document.title = `${nextChallenge.title} · OxYda2`;
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
    <div className="challenge-app-shell challenge-shell">
      <aside
        className="challenge-sidebar"
        id="desafios"
        aria-label="Recorrido de desafíos"
      >
        <header className="challenge-sidebar__header">
          <h2 aria-live="polite">{currentChallenge.title}</h2>
          <span
            className="challenge-sidebar__count"
            aria-label={`${completedIds.size} de ${challenges.length} desafíos completados`}
          >
            {completedIds.size} / {challenges.length}
          </span>
        </header>
        <div className="challenge-families-scrollarea">
          <div className="challenge-families" ref={familiesRef}>
            {families.map((family) => {
              const familyChallenges = challenges.filter(
                (item) => item.familyId === family.id,
              );
              const isOpen = openFamilyId === family.id;
              return (
                <section
                  className={`challenge-family ${isOpen ? 'is-open' : ''}`}
                  data-family-id={family.id}
                  key={family.id}
                  aria-labelledby={`family-${family.id}`}
                >
                  <button
                    type="button"
                    className="challenge-family__header"
                    aria-expanded={isOpen}
                    aria-controls={`family-options-${family.id}`}
                    onClick={() =>
                      setOpenFamilyId((previous) =>
                        previous === family.id ? null : family.id,
                      )
                    }
                  >
                    <FamilyIcon familyId={family.id} />
                    <span className="challenge-family__heading">
                      <span
                        className="challenge-family__title"
                        id={`family-${family.id}`}
                        role="heading"
                        aria-level={3}
                      >
                        {family.title}
                      </span>
                      <span className="challenge-family__description">
                        {family.description}
                      </span>
                    </span>
                    <span className="challenge-family__meta">
                      <span className="challenge-family__count">
                        {familyChallenges.length} opciones
                      </span>
                      <span
                        className="challenge-family__toggle"
                        aria-hidden="true"
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </span>
                  </button>
                  <div
                    className="challenge-family__content"
                    id={`family-options-${family.id}`}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                  >
                    <ol className="challenge-family__list">
                      {familyChallenges.map((item) => {
                        const status = statusFor(item.id);
                        const index = challenges.indexOf(item);
                        return (
                          <li
                            key={item.id}
                            className={`challenge-list__item is-${status} ${item.id === currentId ? 'is-selected' : ''}`}
                          >
                            <button
                              type="button"
                              className="challenge-list__button"
                              onClick={() => selectChallenge(item.id)}
                              aria-current={
                                item.id === currentId ? 'step' : undefined
                              }
                              aria-label={`${String(index + 1).padStart(2, '0')} ${item.title}, ${statusLabels[status]}. ${item.scenario}`}
                            >
                              <span
                                className="challenge-list__index"
                                aria-hidden="true"
                              >
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className="challenge-list__copy">
                                <strong>{item.title}</strong>
                                <span className="challenge-list__description">
                                  {item.scenario}
                                </span>
                                <span
                                  className="challenge-list__status-marker"
                                  aria-hidden="true"
                                >
                                  {status === 'completed' ? (
                                    <CompletionStatusIcon />
                                  ) : status === 'active' ? (
                                    '●'
                                  ) : null}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </section>
              );
            })}
          </div>
          <div
            className={`challenge-families__scrollbar ${familiesScrollbar.isScrollable ? 'is-scrollable' : ''}`}
            ref={scrollbarRef}
            aria-hidden="true"
            style={
              {
                '--challenge-scroll-thumb-offset': `${familiesScrollbar.thumbOffset}px`,
                '--challenge-scroll-thumb-size': `${familiesScrollbar.thumbSize}px`,
              } as CSSProperties
            }
          >
            <span className="challenge-families__scrollbar-thumb" />
          </div>
        </div>
      </aside>

      <main
        className="challenge-workspace"
        aria-label="Espacio de trabajo del desafío"
      >
        <StorageNotice message={message} />
        {finished ? (
          <section
            className="challenge-complete"
            aria-labelledby="challenge-complete-title"
          >
            <header className="challenge-complete__header">
              <span className="completion-symbol" aria-hidden="true">
                ✓
              </span>
              <div>
                <p className="eyebrow">Recorrido completo</p>
                <span className="challenge-complete__index">
                  {completedIds.size} / {challenges.length}
                </span>
              </div>
            </header>
            <div className="challenge-complete__body">
              <h1
                tabIndex={-1}
                ref={resultHeading}
                id="challenge-complete-title"
              >
                Terminaste el recorrido.
                <br />
                Las relaciones quedan a mano.
              </h1>
              <p className="lead">{currentChallenge.takeaway}</p>
              <div className="used-skills">
                <h2>Habilidades que pusiste en juego</h2>
                <ul>
                  {filteredSkills.map((skill) => (
                    <li key={skill.id}>{skill.title}</li>
                  ))}
                </ul>
              </div>
              <div className="answer-actions">
                <AnimatedArrowLink className="button button-primary" href="/">
                  Volver al inicio
                </AnimatedArrowLink>
                <a className="button button-secondary" href="/mapa">
                  Ver mi mapa
                </a>
              </div>
            </div>
          </section>
        ) : (
          <div className="challenge-workspace__inner">
            <header className="workspace-header">
              <div className="workspace-header__intro">
                <span className="eyebrow">
                  {currentFamily?.title ?? 'Desafío'}
                </span>
                <h1>{currentChallenge.title}</h1>
                <p title={currentChallenge.scenario}>
                  <ScenarioText text={currentChallenge.scenario} />
                </p>
              </div>
              <span className="workspace-header__progress">
                {completedIds.size} de {challenges.length} resueltas
              </span>
            </header>
            {step && (
              <div className="workspace-content" ref={workspaceContent}>
                <section
                  className="workspace-task"
                  aria-label="Resolver el paso actual"
                >
                  <div className="runner-meta">
                    <span>{step.label ?? 'Paso actual'}</span>
                    <span>
                      Paso {stepIndex + 1} de {currentChallenge.steps.length}
                    </span>
                  </div>
                  <div className="step-track" aria-hidden="true">
                    {currentChallenge.steps.map((item, index) => (
                      <span
                        key={item.id}
                        className={index <= stepIndex ? 'is-current' : ''}
                      />
                    ))}
                  </div>
                  <StepPanel
                    key={`${currentChallenge.id}-${step.id}`}
                    step={step}
                    ready={ready}
                    onEvaluated={evaluated}
                    onNext={next}
                    finalStep={stepIndex === currentChallenge.steps.length - 1}
                    focusOnMount={stepIndex > 0}
                  />
                </section>
                <ChallengeContext
                  challenge={currentChallenge}
                  activeStep={step}
                  stepIndex={stepIndex}
                  totalSteps={currentChallenge.steps.length}
                  variant="runner"
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
