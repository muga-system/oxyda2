import type { Challenge, ChallengeStep } from '../../shared/domain/types';
import { formatNumber } from '../../shared/ui/format';
import { kindLabels } from '../../shared/ui/labels';

interface Props {
  challenge: Challenge;
  activeStep?: ChallengeStep;
  stepIndex?: number;
  totalSteps?: number;
  variant?: 'legacy' | 'runner';
}

export default function ChallengeContext({
  challenge,
  activeStep,
  stepIndex = 0,
  totalSteps = challenge.steps.length,
  variant = 'legacy',
}: Props) {
  if (variant === 'legacy')
    return (
      <div className="challenge-context">
        <p className="scenario">{challenge.scenario}</p>
        {challenge.comparison && (
          <div className="comparison">
            {challenge.comparison.map((item) => (
              <div className="comparison-item" key={item.label}>
                <span className="eyebrow">{item.label}</span>
                <strong>{item.value}</strong>
                {item.detail && <span className="muted">{item.detail}</span>}
              </div>
            ))}
          </div>
        )}
        {challenge.chart && (
          <figure className="data-chart">
            <figcaption>{challenge.chart.title}</figcaption>
            <p className="chart-axis">
              El eje comienza en {formatNumber(challenge.chart.baseline)}{' '}
              {challenge.chart.unit}.
            </p>
            {challenge.chart.values.map((item) => {
              const highest = Math.max(
                ...challenge.chart!.values.map((entry) => entry.value),
              );
              const span = highest - challenge.chart!.baseline;
              const width =
                span > 0
                  ? Math.max(
                      1,
                      ((item.value - challenge.chart!.baseline) / span) * 100,
                    )
                  : 100;
              return (
                <div className="chart-row" key={item.label}>
                  <span>{item.label}</span>
                  <div className="chart-track" aria-hidden="true">
                    <span style={{ width: `${width}%` }} />
                  </div>
                  <strong>
                    {formatNumber(item.value)} {challenge.chart!.unit}
                  </strong>
                </div>
              );
            })}
            <p className="chart-caption">
              Los valores están escritos junto a cada barra.
            </p>
          </figure>
        )}
      </div>
    );

  const currentStep = activeStep ?? challenge.steps[0]!;
  const context = challenge.context;
  const operationStepIndex = challenge.steps.findIndex(
    (step) => step.kind === 'calculate',
  );
  const decisionStepIndex = challenge.steps.findIndex(
    (step) => step.kind === 'decide',
  );
  const operationVisible =
    Boolean(context?.operation) &&
    (operationStepIndex < 0 || stepIndex >= operationStepIndex);
  const resultVisible =
    Boolean(context?.result?.length) &&
    (decisionStepIndex < 0 || stepIndex >= decisionStepIndex);

  return (
    <aside
      className="challenge-context challenge-context--runner"
      aria-label="Contexto matemático"
    >
      <header className="challenge-context__header">
        <span>Relación en juego</span>
        <span className="challenge-context__index">
          {String(stepIndex + 1).padStart(2, '0')} /{' '}
          {String(totalSteps).padStart(2, '0')}
        </span>
      </header>
      {context?.base && (
        <div className="runner-math__base">
          <span>{context.base.label}</span>
          <strong>{context.base.value}</strong>
        </div>
      )}
      {challenge.comparison && (
        <div className="comparison">
          <div className="comparison-heading">
            <span>Ofertas en juego</span>
            <span>unidad</span>
          </div>
          {challenge.comparison.map((item) => (
            <div className="comparison-item" key={item.label}>
              <span className="comparison-item__label">{item.label}</span>
              <strong>{item.value}</strong>
              {item.detail && <span className="muted">{item.detail}</span>}
            </div>
          ))}
        </div>
      )}
      {challenge.chart && (
        <figure className="data-chart">
          <figcaption>{challenge.chart.title}</figcaption>
          <p className="chart-axis">
            El eje comienza en {formatNumber(challenge.chart.baseline)}{' '}
            {challenge.chart.unit}.
          </p>
          {challenge.chart.values.map((item) => {
            const highest = Math.max(
              ...challenge.chart!.values.map((entry) => entry.value),
            );
            const span = highest - challenge.chart!.baseline;
            const width =
              span > 0
                ? Math.max(
                    1,
                    ((item.value - challenge.chart!.baseline) / span) * 100,
                  )
                : 100;
            return (
              <div className="chart-row" key={item.label}>
                <span>{item.label}</span>
                <div className="chart-track" aria-hidden="true">
                  <span style={{ width: `${width}%` }} />
                </div>
                <strong>
                  {formatNumber(item.value)} {challenge.chart!.unit}
                </strong>
              </div>
            );
          })}
          <p className="chart-caption">
            Los valores están escritos junto a cada barra.
          </p>
        </figure>
      )}
      {operationVisible && context?.operation && (
        <div
          className="runner-math__reveal"
          aria-label="Operación del descuento"
        >
          <div className="runner-math__operation">
            <span>{context.operation.label}</span>
            <code>{context.operation.value}</code>
          </div>
          {resultVisible ? (
            <div className="runner-math__result">
              {context.result?.map((item, index) => (
                <div
                  className={
                    index === context.result!.length - 1
                      ? 'runner-math__difference'
                      : undefined
                  }
                  key={item.label}
                >
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          ) : (
            context.pendingLabel && (
              <p className="runner-math__pending">{context.pendingLabel}</p>
            )
          )}
        </div>
      )}
      <div className="challenge-context__focus">
        <span className="challenge-context__focus-index">
          Paso {String(stepIndex + 1).padStart(2, '0')}
        </span>
        <strong>{kindLabels[currentStep.kind]}</strong>
        <span>{currentStep.label ?? 'Paso actual'}</span>
        <p className="challenge-context__note">
          La pregunta cambia cuando cambia la relación entre los datos.
        </p>
      </div>
    </aside>
  );
}
