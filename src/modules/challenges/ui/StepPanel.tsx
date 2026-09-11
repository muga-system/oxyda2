import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import type {
  ChallengeKind,
  ChallengeStep,
} from '../../../shared/domain/types';
import { resolveAttempt } from '../application/attempts';
import { formatNumber } from '../../../shared/ui/format';
import { kindLabels } from '../../../shared/ui/labels';
import { AnimatedArrowButton } from '../../../components/react/AnimatedArrowAction';
import { AnimatedIconButton } from '../../../components/react/AnimatedIconAction';
import { CircleCheckIcon } from '../../../components/react/icons/circle-check';
import { SearchIcon } from '../../../components/react/icons/search';
import ChoiceLetterImage from './ChoiceLetterImage';

export type AttemptResult = ReturnType<typeof resolveAttempt>;

interface Props {
  step: ChallengeStep;
  mode?: 'normal' | 'diagnostic';
  ready: boolean;
  onEvaluated: (result: AttemptResult) => void;
  onNext: () => void;
  finalStep?: boolean;
  focusOnMount?: boolean;
}

const reasoningCues: Record<ChallengeKind, string> = {
  recognize: 'Nombrá la relación que importa.',
  estimate: 'Anticipá la escala antes de calcular.',
  calculate: 'Obtené el valor que falta.',
  debug: 'Encontrá dónde se rompió el razonamiento.',
  compare: 'Poné las cantidades en relación.',
  reverse: 'Volvé desde el resultado hacia el origen.',
  decide: 'Usá la relación para tomar una decisión.',
};

export default function StepPanel({
  step,
  mode = 'normal',
  ready,
  onEvaluated,
  onNext,
  finalStep = false,
  focusOnMount = false,
}: Props) {
  const [raw, setRaw] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [unknownAnswer, setUnknownAnswer] = useState(false);
  const [validation, setValidation] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const optionGroup = useRef<HTMLFieldSetElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const feedbackDialog = useRef<HTMLDialogElement>(null);
  const hintDialog = useRef<HTMLDialogElement>(null);
  const hintCloseButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusOnMount) {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const workspace = document.querySelector<HTMLElement>(
        '.challenge-workspace__inner, .challenge-shell',
      );
      const workspaceScrollTop = workspace?.scrollTop ?? 0;
      heading.current?.focus({ preventScroll: true });
      window.scrollTo(scrollX, scrollY);
      if (workspace) workspace.scrollTop = workspaceScrollTop;
    }
  }, [focusOnMount]);

  useEffect(() => {
    const dialog = feedbackDialog.current;
    if (!result) {
      if (dialog?.open) dialog.close();
      return;
    }

    if (dialog && !dialog.open) dialog.showModal();
    const workspace = document.querySelector<HTMLElement>(
      '.challenge-workspace__inner, .challenge-shell',
    );
    const workspaceScrollTop = workspace?.scrollTop ?? 0;
    nextButton.current?.focus({ preventScroll: true });
    if (workspace) workspace.scrollTop = workspaceScrollTop;

    return () => {
      if (dialog?.open) dialog.close();
    };
  }, [result]);

  useEffect(() => {
    const dialog = hintDialog.current;
    if (!dialog) return;

    if (hintVisible) {
      if (!dialog.open) dialog.showModal();
      hintCloseButton.current?.focus({ preventScroll: true });
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [hintVisible]);

  function submit(event?: SubmitEvent<HTMLFormElement>, dontKnow = false) {
    event?.preventDefault();
    if (!ready || result) return;
    if (!dontKnow && raw.trim() === '') {
      setValidation(
        step.answer.type === 'numeric'
          ? 'Escribí un número para continuar.'
          : 'Elegí una respuesta para continuar.',
      );
      return;
    }
    const answer = dontKnow ? '__unknown__' : raw;
    const next = resolveAttempt(step, answer, { attempts, usedHint, mode });
    if (!next.evaluation.valid) {
      setValidation(next.evaluation.feedback);
      return;
    }
    setValidation('');
    setHintVisible(false);
    setResult(next);
    setUnknownAnswer(dontKnow);
    setAttempts(next.attempts);
    onEvaluated(next);
  }

  function retry() {
    setResult(null);
    setUnknownAnswer(false);
    setRaw('');
    setValidation('');
    requestAnimationFrame(() => {
      if (step.answer.type === 'numeric')
        input.current?.focus({ preventScroll: true });
      else
        optionGroup.current
          ?.querySelector<HTMLInputElement>('input')
          ?.focus({ preventScroll: true });
    });
  }

  const answerSpec = step.answer;
  const solution =
    answerSpec.type === 'numeric'
      ? `${formatNumber(answerSpec.expected)}${answerSpec.unit ? ` ${answerSpec.unit}` : ''}`
      : answerSpec.options.find(
          (option) => option.id === answerSpec.correctOptionId,
        )?.label;
  const unit = answerSpec.type === 'numeric' ? answerSpec.unit : undefined;
  const prefix = unit === '$' ? '$' : undefined;
  const suffix = unit && unit !== '$' ? unit : undefined;

  return (
    <section className="step-panel" aria-labelledby={`step-${step.id}`}>
      <header className="step-panel__header">
        <div className="step-panel__signal">
          <span className="step-panel__kind">{kindLabels[step.kind]}</span>
          {step.label && step.label !== kindLabels[step.kind] && (
            <span className="step-panel__subkind">{step.label}</span>
          )}
        </div>
        <p className="step-panel__cue">{reasoningCues[step.kind]}</p>
        <h2 ref={heading} tabIndex={-1} id={`step-${step.id}`}>
          {step.prompt}
        </h2>
      </header>
      {step.debug && (
        <pre className="debug-block">
          <span className="debug-block__header">
            <span>Razonamiento para revisar</span>
            <span>inspección</span>
          </span>
          <code>{step.debug}</code>
        </pre>
      )}
      <form onSubmit={submit} noValidate>
        {step.answer.type === 'single-choice' ? (
          <fieldset
            className="choices"
            ref={optionGroup}
            disabled={Boolean(result) || !ready}
          >
            <legend className="sr-only">Elegí una respuesta</legend>
            {step.answer.options.map((option, index) => (
              <label
                className={`choice ${raw === option.id ? 'is-selected' : ''}`}
                key={option.id}
              >
                <input
                  type="radio"
                  name={step.id}
                  value={option.id}
                  checked={raw === option.id}
                  onChange={() => {
                    setRaw(option.id);
                    setValidation('');
                  }}
                />
                <span className="choice-index" aria-hidden="true">
                  <ChoiceLetterImage index={index} />
                </span>
                <span className="choice-label">{option.label}</span>
                <span className="choice-status" aria-hidden="true">
                  {raw === option.id ? 'Elegida' : ''}
                </span>
              </label>
            ))}
          </fieldset>
        ) : (
          <div className="numeric-field">
            <label
              className="numeric-field__label"
              htmlFor={`answer-${step.id}`}
            >
              Escribí el valor
              {unit && <span>{unit === '$' ? 'en pesos' : `en ${unit}`}</span>}
            </label>
            <div className="numeric-input-wrap" data-unit={unit ?? 'number'}>
              {prefix && (
                <span className="numeric-input-wrap__prefix" aria-hidden="true">
                  {prefix}
                </span>
              )}
              <input
                ref={input}
                id={`answer-${step.id}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                value={raw}
                onChange={(event) => {
                  setRaw(event.target.value);
                  setValidation('');
                }}
                disabled={Boolean(result) || !ready}
                aria-describedby={`help-${step.id}`}
                aria-invalid={Boolean(validation)}
              />
              {suffix && (
                <span className="numeric-input-wrap__suffix" aria-hidden="true">
                  {suffix}
                </span>
              )}
            </div>
            <p className="input-help" id={`help-${step.id}`}>
              Podés usar coma o punto decimal. Para miles, usá un espacio o
              escribí las cifras juntas.
            </p>
          </div>
        )}
        <p className="validation-message" role="alert">
          {validation}
        </p>
        {!result && (
          <div className="answer-actions">
            <AnimatedIconButton
              className="button button-primary answer-actions__icon-button"
              type="submit"
              disabled={!ready}
              icon={CircleCheckIcon}
              label="Comprobar respuesta"
              showLabel
            />
            {mode === 'diagnostic' ? (
              <AnimatedIconButton
                className="button button-quiet answer-actions__icon-button"
                data-action="hint"
                type="button"
                disabled={!ready}
                onClick={() => submit(undefined, true)}
                icon={SearchIcon}
                label="No sé todavía"
                showLabel
              />
            ) : step.hints?.length ? (
              <AnimatedIconButton
                className="button button-quiet answer-actions__icon-button"
                data-action="hint"
                type="button"
                aria-expanded={hintVisible}
                onClick={() => {
                  setUsedHint(true);
                  setHintVisible(!hintVisible);
                }}
                icon={SearchIcon}
                label={hintVisible ? 'Ocultar pista' : 'Necesito una pista'}
                showLabel
                aria-controls={`hint-dialog-${step.id}`}
              />
            ) : null}
          </div>
        )}
      </form>
      <dialog
        ref={hintDialog}
        id={`hint-dialog-${step.id}`}
        className="feedback-dialog hint-dialog"
        aria-labelledby={`hint-dialog-title-${step.id}`}
        aria-describedby={`hint-dialog-copy-${step.id}`}
        onCancel={() => setHintVisible(false)}
      >
        <div className="feedback-dialog__inner">
          <div className="feedback-dialog__header">
            <span
              className="feedback-dialog__symbol hint-dialog__symbol"
              aria-hidden="true"
            >
              ?
            </span>
            <div>
              <span className="feedback-dialog__eyebrow">Pista 1</span>
              <h2 id={`hint-dialog-title-${step.id}`}>Una pista para seguir</h2>
            </div>
          </div>
          <p
            className="feedback-dialog__feedback"
            id={`hint-dialog-copy-${step.id}`}
          >
            {step.hints?.[0]}
          </p>
          <div className="step-next">
            <button
              ref={hintCloseButton}
              className="button button-primary"
              type="button"
              onClick={() => setHintVisible(false)}
            >
              Cerrar pista
            </button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={feedbackDialog}
        className={`feedback-dialog ${unknownAnswer ? 'feedback-dialog--neutral' : result?.evaluation.correct ? 'feedback-dialog--success' : 'feedback-dialog--review'}`}
        aria-labelledby={`feedback-dialog-title-${step.id}`}
        aria-describedby={`feedback-dialog-copy-${step.id}`}
        onCancel={(event) => event.preventDefault()}
      >
        {result && (
          <div className="feedback-dialog__inner">
            <div className="feedback-dialog__header">
              <span className="feedback-dialog__symbol" aria-hidden="true">
                {unknownAnswer ? '·' : result.evaluation.correct ? '✓' : '↳'}
              </span>
              <div>
                <span className="feedback-dialog__eyebrow">
                  {unknownAnswer
                    ? 'Respuesta registrada'
                    : result.evaluation.correct
                      ? 'Paso resuelto'
                      : 'Para revisar'}
                </span>
                <h2 id={`feedback-dialog-title-${step.id}`}>
                  {unknownAnswer
                    ? 'Registrado.'
                    : result.evaluation.correct
                      ? 'Tiene sentido.'
                      : result.done
                        ? 'Revisemos la idea.'
                        : 'Hay algo para revisar.'}
                </h2>
              </div>
            </div>
            <div id={`feedback-dialog-copy-${step.id}`}>
              <p className="feedback-dialog__feedback">
                {result.evaluation.feedback}
              </p>
              {result.done && !result.evaluation.correct && !unknownAnswer && (
                <p className="feedback-dialog__solution">
                  <strong>Respuesta: </strong>
                  {solution}
                </p>
              )}
              {result.done && !unknownAnswer && (
                <p className="feedback-dialog__explanation">
                  {step.explanation}
                </p>
              )}
            </div>
            <div className="step-next">
              <AnimatedArrowButton
                ref={nextButton}
                className="button button-primary"
                onClick={result.done ? onNext : retry}
              >
                {result.done
                  ? finalStep
                    ? mode === 'diagnostic'
                      ? 'Ver mi lectura'
                      : 'Cerrar desafío'
                    : 'Continuar'
                  : 'Volver a intentar'}
              </AnimatedArrowButton>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
