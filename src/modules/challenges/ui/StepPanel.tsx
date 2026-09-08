import { useEffect, useRef, useState, type SubmitEvent } from 'react';
import type {
  ChallengeKind,
  ChallengeStep,
} from '../../../shared/domain/types';
import { resolveAttempt } from '../application/attempts';
import { formatNumber } from '../../../shared/ui/format';
import { kindLabels } from '../../../shared/ui/labels';
import { ArrowRightIcon } from '../../../components/react/icons/arrow';

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

  useEffect(() => {
    if (focusOnMount) heading.current?.focus();
  }, [focusOnMount]);

  useEffect(() => {
    if (result) nextButton.current?.focus();
  }, [result]);

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
      if (step.answer.type === 'numeric') input.current?.focus();
      else
        optionGroup.current?.querySelector<HTMLInputElement>('input')?.focus();
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
                  {String.fromCharCode(65 + index)}
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
            <button
              className="button button-primary"
              type="submit"
              disabled={!ready}
            >
              Comprobar <ArrowRightIcon aria-hidden="true" size={17} />
            </button>
            {mode === 'diagnostic' ? (
              <button
                className="button button-quiet"
                type="button"
                disabled={!ready}
                onClick={() => submit(undefined, true)}
              >
                No sé todavía
              </button>
            ) : step.hints?.length ? (
              <button
                className="button button-quiet"
                type="button"
                aria-expanded={hintVisible}
                onClick={() => {
                  setUsedHint(true);
                  setHintVisible(!hintVisible);
                }}
              >
                {hintVisible ? 'Ocultar pista' : 'Necesito una pista'}
              </button>
            ) : null}
          </div>
        )}
      </form>
      {hintVisible && !result?.done && (
        <aside className="hint">
          <strong>Pista 1</strong>
          <p>{step.hints?.[0]}</p>
        </aside>
      )}
      <div className="feedback-region" aria-live="polite" aria-atomic="true">
        {result && (
          <div
            className={`feedback ${unknownAnswer ? 'feedback-neutral' : result.evaluation.correct ? 'feedback-success' : 'feedback-review'}`}
          >
            <div className="feedback-title">
              <span aria-hidden="true">
                {unknownAnswer ? '·' : result.evaluation.correct ? '✓' : '↳'}
              </span>
              <strong>
                {unknownAnswer
                  ? 'Registrado.'
                  : result.evaluation.correct
                    ? 'Tiene sentido.'
                    : result.done
                      ? 'Revisemos la idea.'
                      : 'Hay algo para revisar.'}
              </strong>
            </div>
            <p>{result.evaluation.feedback}</p>
            {result.done && !result.evaluation.correct && !unknownAnswer && (
              <p className="solution">
                <strong>Respuesta: </strong>
                {solution}
              </p>
            )}
            {result.done && !unknownAnswer && <p>{step.explanation}</p>}
          </div>
        )}
      </div>
      {result && (
        <div className="step-next">
          <button
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
              : 'Volver a intentar'}{' '}
            <ArrowRightIcon aria-hidden="true" size={17} />
          </button>
        </div>
      )}
    </section>
  );
}
