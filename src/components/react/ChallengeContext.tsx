import type { Challenge } from '../../shared/domain/types';
import { formatNumber } from '../../shared/ui/format';

export default function ChallengeContext({
  challenge,
}: {
  challenge: Challenge;
}) {
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
}
