import type { ChallengeStep } from '../../../shared/domain/types';

type SceneVariant = 'compare' | 'estimate' | 'calculate' | 'decide' | 'verify';

interface SceneDefinition {
  variant: SceneVariant;
  label: string;
  index: string;
}

const scenes: Record<string, SceneDefinition> = {
  'same-unit': {
    variant: 'compare',
    label: 'Encontrar una medida común',
    index: '01 / 05',
  },
  'quarter-estimate': {
    variant: 'estimate',
    label: 'Anticipar la escala',
    index: '02 / 05',
  },
  'discount-amount': {
    variant: 'calculate',
    label: 'Resolver la parte',
    index: '03 / 05',
  },
  'choose-store': {
    variant: 'decide',
    label: 'Tomar una decisión',
    index: '04 / 05',
  },
  'verify-discount': {
    variant: 'verify',
    label: 'Comprobar el resultado',
    index: '05 / 05',
  },
};

export default function ChallengeScene({ step }: { step: ChallengeStep }) {
  const scene = scenes[step.id];
  if (!scene) return null;

  return (
    <div
      className={`challenge-scene challenge-scene--${scene.variant}`}
      aria-hidden="true"
    >
      <div className="challenge-scene__header">
        <span>{scene.label}</span>
        <span>{scene.index}</span>
      </div>

      {scene.variant === 'compare' && (
        <div className="challenge-scene__comparison">
          <div className="challenge-scene__tile">
            <span>Oferta A</span>
            <strong>25%</strong>
            <div className="challenge-scene__bar">
              <span style={{ width: '25%' }} />
            </div>
          </div>
          <div className="challenge-scene__tile">
            <span>Oferta B</span>
            <strong>$18.000</strong>
            <div className="challenge-scene__bar challenge-scene__bar--muted">
              <span style={{ width: '90%' }} />
            </div>
          </div>
          <p className="challenge-scene__caption">
            Dos ofertas. Una misma medida para compararlas.
          </p>
        </div>
      )}

      {scene.variant === 'estimate' && (
        <div className="challenge-scene__estimate">
          <div className="challenge-scene__metric">
            <span>Precio original</span>
            <strong>$80.000</strong>
          </div>
          <div
            className="challenge-scene__quarters"
            aria-label="Una de cuatro partes"
          >
            {[0, 1, 2, 3].map((part) => (
              <span className={part === 0 ? 'is-active' : ''} key={part} />
            ))}
          </div>
          <strong className="challenge-scene__answer">≈ $20.000</strong>
        </div>
      )}

      {scene.variant === 'calculate' && (
        <div className="challenge-scene__equation">
          <div className="challenge-scene__metric">
            <span>Base</span>
            <strong>80.000</strong>
          </div>
          <span className="challenge-scene__operator">× 0,25</span>
          <div className="challenge-scene__slot">
            <span>Resultado</span>
            <strong>?</strong>
          </div>
        </div>
      )}

      {scene.variant === 'decide' && (
        <div className="challenge-scene__decision">
          <div className="challenge-scene__tile">
            <span>Tienda A</span>
            <strong>$60.000</strong>
            <small>precio final</small>
          </div>
          <div className="challenge-scene__tile">
            <span>Tienda B</span>
            <strong>$62.000</strong>
            <small>precio final</small>
          </div>
        </div>
      )}

      {scene.variant === 'verify' && (
        <div className="challenge-scene__verification">
          <span>Una cuarta parte</span>
          <strong>20.000 × 4 = 80.000</strong>
        </div>
      )}
    </div>
  );
}
