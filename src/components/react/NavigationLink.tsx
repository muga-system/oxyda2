import { useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import type { AnimatedIconHandle } from './icons/animated-icon';
import { BookTextIcon } from './icons/book-text';
import { HomeIcon } from './icons/home';
import { MapPinIcon } from './icons/map-pin';
import { ScanTextIcon } from './icons/scan-text';
import { SearchIcon } from './icons/search';

const icons = {
  home: HomeIcon,
  'book-open': BookTextIcon,
  search: SearchIcon,
  'scan-line': ScanTextIcon,
  map: MapPinIcon,
} as const;

interface NavigationLinkProps {
  href: string;
  label: string;
  icon: keyof typeof icons;
  variant: 'top' | 'side';
  current?: boolean;
}

export default function NavigationLink({
  href,
  label,
  icon,
  variant,
  current = false,
}: NavigationLinkProps) {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const hovered = useRef(false);
  const focused = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = prefersReducedMotion !== false;
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
      className={`nav-link nav-link--${variant}`}
      href={href}
      aria-current={current ? 'page' : undefined}
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
      <span className="nav-link__icon" aria-hidden="true">
        <Icon ref={iconRef} reducedMotion={reducedMotion} />
      </span>
      <span className="nav-link__label">{label}</span>
    </a>
  );
}
