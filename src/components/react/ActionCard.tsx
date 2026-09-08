import { useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import type { AnimatedIconHandle } from './icons/animated-icon';
import { BookTextIcon } from './icons/book-text';
import { CompassIcon } from './icons/compass';
import { MapPinIcon } from './icons/map-pin';
import { ScanTextIcon } from './icons/scan-text';
import { SearchIcon } from './icons/search';
import { ArrowRightIcon } from './icons/arrow';

const icons = {
  compass: CompassIcon,
  'book-open': BookTextIcon,
  search: SearchIcon,
  'scan-line': ScanTextIcon,
  map: MapPinIcon,
} as const;

interface ActionCardProps {
  href: string;
  title: string;
  description: string;
  icon: keyof typeof icons;
  layout?: 'wide' | 'compact' | 'horizontal';
  reducedMotionOverride?: boolean;
}

export function ActionCard({
  href,
  title,
  description,
  icon,
  layout = 'compact',
  reducedMotionOverride = false,
}: ActionCardProps) {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const arrowRef = useRef<AnimatedIconHandle>(null);
  const hovered = useRef(false);
  const focused = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = reducedMotionOverride || prefersReducedMotion !== false;
  const Icon = icons[icon];

  function startAnimation() {
    if (
      reducedMotion ||
      document.documentElement.dataset['reducedMotion'] === 'true'
    ) {
      iconRef.current?.stopAnimation();
      arrowRef.current?.stopAnimation();
      return;
    }
    iconRef.current?.startAnimation();
    arrowRef.current?.startAnimation();
  }

  function stopWhenInactive() {
    if (!hovered.current && !focused.current) {
      iconRef.current?.stopAnimation();
      arrowRef.current?.stopAnimation();
    }
  }

  return (
    <a
      className={`action-card action-card--${layout}`}
      href={href}
      onMouseEnter={() => {
        hovered.current = true;
        startAnimation();
      }}
      onMouseLeave={() => {
        hovered.current = false;
        stopWhenInactive();
      }}
      onFocus={() => {
        focused.current = true;
        startAnimation();
      }}
      onBlur={() => {
        focused.current = false;
        stopWhenInactive();
      }}
    >
      <span className="action-card__icon-frame" aria-hidden="true">
        <Icon
          ref={iconRef}
          className="action-card__icon"
          reducedMotion={reducedMotion}
        />
      </span>
      <span className="action-card__body">
        <span className="action-card__title">{title}</span>
        <span className="action-card__description">{description}</span>
      </span>
      <ArrowRightIcon
        ref={arrowRef}
        className="action-card__arrow"
        size={20}
        reducedMotion={reducedMotion}
      />
    </a>
  );
}

export default ActionCard;
