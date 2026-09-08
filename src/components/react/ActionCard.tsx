import { useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import type { AnimatedIconHandle } from './icons/animated-icon';
import { BookTextIcon } from './icons/book-text';
import { CompassIcon } from './icons/compass';
import { MapPinIcon } from './icons/map-pin';
import { ScanTextIcon } from './icons/scan-text';
import { SearchIcon } from './icons/search';

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
  reducedMotionOverride?: boolean;
}

export function ActionCard({
  href,
  title,
  description,
  icon,
  reducedMotionOverride = false,
}: ActionCardProps) {
  const iconRef = useRef<AnimatedIconHandle>(null);
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
      return;
    }
    iconRef.current?.startAnimation();
  }

  function stopWhenInactive() {
    if (!hovered.current && !focused.current) iconRef.current?.stopAnimation();
  }

  return (
    <a
      className="action-card"
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
      <svg
        className="action-card__arrow"
        aria-hidden="true"
        focusable="false"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </a>
  );
}

export default ActionCard;
