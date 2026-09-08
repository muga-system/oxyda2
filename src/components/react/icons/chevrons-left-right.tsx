// Source: https://lucide-animated.com/r/chevrons-left-right.json
import type { Transition } from 'motion/react';
import { motion } from 'motion/react';
import { forwardRef } from 'react';
import {
  useIconAnimation,
  type AnimatedIconHandle,
  type AnimatedIconProps,
} from './animated-icon';

const DEFAULT_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 250,
  damping: 25,
};

export const ChevronsLeftRightIcon = forwardRef<
  AnimatedIconHandle,
  AnimatedIconProps
>(({ size = 18, className, reducedMotion }, ref) => {
  const controls = useIconAnimation(ref, reducedMotion);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        animate={controls}
        d="m9 7-5 5 5 5"
        initial="normal"
        transition={DEFAULT_TRANSITION}
        variants={{
          normal: { translateX: '0%' },
          animate: { translateX: '-2px' },
        }}
      />
      <motion.path
        animate={controls}
        d="m15 7 5 5-5 5"
        initial="normal"
        transition={DEFAULT_TRANSITION}
        variants={{
          normal: { translateX: '0%' },
          animate: { translateX: '2px' },
        }}
      />
    </svg>
  );
});

ChevronsLeftRightIcon.displayName = 'ChevronsLeftRightIcon';
