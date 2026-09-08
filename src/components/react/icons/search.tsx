// Adapted from https://github.com/pqoqubbw/icons/blob/main/icons/search.tsx.
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

export const SearchIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
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
        variants={{ normal: { x: 0, y: 0 }, animate: { x: -2, y: -2 } }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </motion.svg>
    );
  },
);
SearchIcon.displayName = 'SearchIcon';
