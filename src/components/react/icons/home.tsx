// Adapted from Lucide's home geometry; parent control and subdued motion follow DESIGN.md.
// MIT license: ./LICENSE.lucide-animated.txt
import { motion } from 'motion/react';
import { forwardRef } from 'react';
import {
  iconTransition,
  useIconAnimation,
  type AnimatedIconHandle,
  type AnimatedIconProps,
} from './animated-icon';

export const HomeIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ size = 20, className, reducedMotion }, ref) => {
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
          normal: { y: 0, scale: 1 },
          animate: { y: -1, scale: 1.04 },
        }}
      >
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-6h6v6" />
      </motion.svg>
    );
  },
);

HomeIcon.displayName = 'HomeIcon';
