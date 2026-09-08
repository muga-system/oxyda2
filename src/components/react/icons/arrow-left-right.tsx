// Adapted from Lucide's ArrowLeftRight geometry for the local animated icon set.
import { motion } from 'motion/react';
import { forwardRef } from 'react';
import {
  iconTransition,
  useIconAnimation,
  type AnimatedIconHandle,
  type AnimatedIconProps,
} from './animated-icon';

export const ArrowLeftRightIcon = forwardRef<
  AnimatedIconHandle,
  AnimatedIconProps
>(({ size = 18, className, reducedMotion }, ref) => {
  const controls = useIconAnimation(ref, reducedMotion);

  return (
    <motion.svg
      aria-hidden="true"
      focusable="false"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="normal"
      animate={controls}
      transition={iconTransition}
      variants={{ normal: { x: 0 }, animate: { x: 2 } }}
    >
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </motion.svg>
  );
});

ArrowLeftRightIcon.displayName = 'ArrowLeftRightIcon';
