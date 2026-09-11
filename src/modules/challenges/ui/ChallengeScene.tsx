import type { Challenge, ChallengeStep } from '../../../shared/domain/types';
import { kindLabels } from '../../../shared/ui/labels';

interface Props {
  challenge: Challenge;
  step: ChallengeStep;
  stepIndex: number;
  totalSteps: number;
}

export default function ChallengeScene({
  challenge,
  step,
  stepIndex,
  totalSteps,
}: Props) {
  const visual = challenge.visuals?.[step.id];
  if (!visual) return null;

  return (
    <div
      className={`challenge-scene challenge-scene--${visual.variant}`}
      aria-hidden="true"
    >
      <div className="challenge-scene__header">
        <span>{step.label ?? kindLabels[step.kind]}</span>
        <span>
          {String(stepIndex + 1).padStart(2, '0')} /{' '}
          {String(totalSteps).padStart(2, '0')}
        </span>
      </div>

      {visual.variant === 'comparison' && (
        <div className="challenge-scene__comparison">
          {visual.items.map((item, index) => (
            <div className="challenge-scene__tile" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              {item.bar !== undefined && (
                <div
                  className={`challenge-scene__bar ${index > 0 ? 'challenge-scene__bar--muted' : ''}`}
                >
                  <span style={{ width: `${item.bar}%` }} />
                </div>
              )}
            </div>
          ))}
          {visual.caption && (
            <p className="challenge-scene__caption">{visual.caption}</p>
          )}
        </div>
      )}

      {visual.variant === 'estimate' && (
        <div className="challenge-scene__estimate">
          <div className="challenge-scene__metric">
            <span>{visual.metric.label}</span>
            <strong>{visual.metric.value}</strong>
          </div>
          <div
            className="challenge-scene__quarters"
            aria-label={`${visual.activeParts} de ${visual.parts} partes`}
          >
            {Array.from({ length: visual.parts }, (_, part) => (
              <span
                className={part < visual.activeParts ? 'is-active' : ''}
                key={part}
              />
            ))}
          </div>
          <strong className="challenge-scene__answer">{visual.answer}</strong>
        </div>
      )}

      {visual.variant === 'operation' && (
        <div className="challenge-scene__equation">
          <div className="challenge-scene__metric">
            <span>{visual.base.label}</span>
            <strong>{visual.base.value}</strong>
          </div>
          <span className="challenge-scene__operator">{visual.operator}</span>
          <div className="challenge-scene__slot">
            <span>{visual.result.label}</span>
            <strong>{visual.result.value}</strong>
          </div>
        </div>
      )}

      {visual.variant === 'decision' && (
        <div className="challenge-scene__decision">
          {visual.items.map((item) => (
            <div className="challenge-scene__tile" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              {item.detail && <small>{item.detail}</small>}
            </div>
          ))}
        </div>
      )}

      {visual.variant === 'verification' && (
        <div className="challenge-scene__verification">
          <span>{visual.label}</span>
          <strong>{visual.value}</strong>
        </div>
      )}
    </div>
  );
}
