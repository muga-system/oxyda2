import { useReducedMotion } from 'motion/react';
import {
  forwardRef,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type Ref,
  type ReactNode,
} from 'react';
import type { AnimatedIconHandle } from './icons/animated-icon';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpRightIcon } from './icons/arrow';

type Direction = 'right' | 'down' | 'up-right';

const arrowIcons = {
  right: ArrowRightIcon,
  down: ArrowDownIcon,
  'up-right': ArrowUpRightIcon,
} as const;

interface SharedProps {
  children: ReactNode;
  direction?: Direction;
  arrowClassName?: string;
  reducedMotionOverride?: boolean;
  reload?: boolean;
}

type LinkProps = SharedProps &
  Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur'
  >;

type ButtonProps = SharedProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'children' | 'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur'
  >;

function useArrowInteraction(reducedMotionOverride = false) {
  const arrowRef = useRef<AnimatedIconHandle>(null);
  const hovered = useRef(false);
  const focused = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = reducedMotionOverride || prefersReducedMotion === true;

  function startAnimation() {
    if (
      reducedMotion ||
      document.documentElement.dataset['reducedMotion'] === 'true'
    ) {
      arrowRef.current?.stopAnimation();
      return;
    }
    arrowRef.current?.startAnimation();
  }

  function stopWhenInactive() {
    if (!hovered.current && !focused.current) arrowRef.current?.stopAnimation();
  }

  return {
    arrowRef,
    reducedMotion,
    onMouseEnter: () => {
      hovered.current = true;
      startAnimation();
    },
    onMouseLeave: () => {
      hovered.current = false;
      stopWhenInactive();
    },
    onFocus: () => {
      focused.current = true;
      startAnimation();
    },
    onBlur: () => {
      focused.current = false;
      stopWhenInactive();
    },
  };
}

function AnimatedArrow({
  direction,
  arrowRef,
  reducedMotion,
  className,
}: {
  direction: Direction;
  arrowRef: Ref<AnimatedIconHandle>;
  reducedMotion: boolean;
  className?: string;
}) {
  const Icon = arrowIcons[direction];
  return (
    <Icon
      ref={arrowRef}
      aria-hidden="true"
      className={className}
      size={17}
      reducedMotion={reducedMotion}
    />
  );
}

export function AnimatedArrowLink({
  children,
  direction = 'right',
  arrowClassName,
  reducedMotionOverride = false,
  reload = false,
  className,
  ...props
}: LinkProps) {
  const interaction = useArrowInteraction(reducedMotionOverride);
  return (
    <a
      {...props}
      data-astro-reload={reload || undefined}
      className={className}
      onMouseEnter={interaction.onMouseEnter}
      onMouseLeave={interaction.onMouseLeave}
      onFocus={interaction.onFocus}
      onBlur={interaction.onBlur}
    >
      {children}{' '}
      <AnimatedArrow
        {...interaction}
        className={arrowClassName}
        direction={direction}
      />
    </a>
  );
}

export const AnimatedArrowButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function AnimatedArrowButton(
    {
      children,
      direction = 'right',
      arrowClassName,
      reducedMotionOverride = false,
      className,
      ...props
    },
    ref,
  ) {
    const interaction = useArrowInteraction(reducedMotionOverride);
    return (
      <button
        {...props}
        ref={ref}
        className={className}
        onMouseEnter={interaction.onMouseEnter}
        onMouseLeave={interaction.onMouseLeave}
        onFocus={interaction.onFocus}
        onBlur={interaction.onBlur}
      >
        {children}{' '}
        <AnimatedArrow
          {...interaction}
          className={arrowClassName}
          direction={direction}
        />
      </button>
    );
  },
);

AnimatedArrowButton.displayName = 'AnimatedArrowButton';
