// Adapted from https://github.com/pqoqubbw/icons/blob/main/icons/book-text.tsx.
// Original geometry retained; parent control and subdued motion follow DESIGN.md.
// MIT license: ./LICENSE.lucide-animated.txt
import { motion } from 'motion/react';
import { forwardRef } from 'react';
import {
  iconTransition,
  useIconAnimation,
  type AnimatedIconHandle,
  type AnimatedIconProps,
} from './animated-icon';

export const BookTextIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ size = 28, className, reducedMotion }, ref) => {
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
        variants={{
          normal: { rotate: 0, y: 0 },
          animate: { rotate: -3, y: -1 },
        }}
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
        <path d="M8 11h8" />
        <path d="M8 7h6" />
      </motion.svg>
    );
  },
);
BookTextIcon.displayName = 'BookTextIcon';
