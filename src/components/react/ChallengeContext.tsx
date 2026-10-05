import type { Challenge, ChallengeStep } from '../../shared/domain/types';
import { formatNumber } from '../../shared/ui/format';

interface Props {
  challenge: Challenge;
  activeStep?: ChallengeStep;
  stepIndex?: number;
  /** `runner` reveals operation and results as the steps advance. */
  variant?: 'legacy' | 'runner';
}

function Chart({ chart }: { chart: NonNullable<Challenge['chart']> }) {
  const highest = Math.max(...chart.values.map((entry) => entry.value));
  const span = highest - chart.baseline;
  return (
    <figure className="data-chart">
      <figcaption>{chart.title}</figcaption>
      <p className="data-chart__axis">
        El eje comienza en {formatNumber(chart.baseline)} {chart.unit}.
      </p>
      {chart.values.map((item) => {
        const width =
          span > 0
            ? Math.max(1, ((item.value - chart.baseline) / span) * 100)
            : 100;
        return (
          <div className="data-chart__row" key={item.label}>
            <span>{item.label}</span>
            <div className="data-chart__track" aria-hidden="true">
              <span style={{ width: `${width}%` }} />
            </div>
            <strong>
              {formatNumber(item.value)} {chart.unit}
            </strong>
          </div>
        );
      })}
    </figure>
  );
}

export default function ChallengeContext({
  challenge,
  activeStep,
  stepIndex = 0,
  variant = 'legacy',
}: Props) {
  const context = variant === 'runner' ? challenge.context : undefined;
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
    <div
      className="context"
      aria-label={
        activeStep ? 'Datos de la situación' : 'Datos de esta situación'
      }
    >
      {variant === 'legacy' && (
        <p className="context__scenario">{challenge.scenario}</p>
      )}
      {(context?.base || challenge.comparison) && (
        <dl className="context__data">
          {context?.base && (
            <div>
              <dt>{context.base.label}</dt>
              <dd>{context.base.value}</dd>
            </div>
          )}
          {challenge.comparison?.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>
                {item.value}
                {item.detail && <span> {item.detail}</span>}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {challenge.chart && <Chart chart={challenge.chart} />}
      {operationVisible && context?.operation && (
        <dl
          className="context__data context__data--reveal"
          aria-label="Cuentas que ya aparecieron"
        >
          <div>
            <dt>{context.operation.label}</dt>
            <dd>
              <code>{context.operation.value}</code>
            </dd>
          </div>
          {resultVisible
            ? context.result?.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))
            : context.pendingLabel && (
                <div>
                  <dt>Pendiente</dt>
                  <dd className="context__pending">{context.pendingLabel}</dd>
                </div>
              )}
        </dl>
      )}
    </div>
  );
}
