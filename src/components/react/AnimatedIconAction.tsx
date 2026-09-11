import { useReducedMotion } from 'motion/react';
import {
  forwardRef,
  useRef,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type Ref,
  type RefAttributes,
} from 'react';
import type {
  AnimatedIconHandle,
  AnimatedIconProps,
} from './icons/animated-icon';

type AnimatedIcon = ForwardRefExoticComponent<
  AnimatedIconProps & RefAttributes<AnimatedIconHandle>
>;

type Props = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur'
> & {
  icon: AnimatedIcon;
  label: string;
  iconSize?: number;
  reducedMotionOverride?: boolean;
  showLabel?: boolean;
};

function useIconInteraction(reducedMotionOverride: boolean) {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const hovered = useRef(false);
  const focused = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = reducedMotionOverride || prefersReducedMotion === true;

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
    if (!hovered.current && !focused.current) {
      iconRef.current?.stopAnimation();
    }
  }

  return {
    iconRef,
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

export const AnimatedIconButton = forwardRef<HTMLButtonElement, Props>(
  function AnimatedIconButton(
    {
      icon: Icon,
      label,
      iconSize = 22,
      reducedMotionOverride = false,
      showLabel = false,
      className,
      ...props
    },
    ref,
  ) {
    const interaction = useIconInteraction(reducedMotionOverride);

    return (
      <button
        {...props}
        ref={ref as Ref<HTMLButtonElement>}
        className={className}
        aria-label={label}
        data-show-label={showLabel ? 'true' : undefined}
        onMouseEnter={interaction.onMouseEnter}
        onMouseLeave={interaction.onMouseLeave}
        onFocus={interaction.onFocus}
        onBlur={interaction.onBlur}
      >
        <Icon
          ref={interaction.iconRef}
          aria-hidden="true"
          size={iconSize}
          reducedMotion={interaction.reducedMotion}
        />
        {showLabel && <span className="button__label">{label}</span>}
      </button>
    );
  },
);

AnimatedIconButton.displayName = 'AnimatedIconButton';
