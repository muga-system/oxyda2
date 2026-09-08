// Adapted from https://github.com/pqoqubbw/icons/blob/main/icons/compass.tsx.
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

export const CompassIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ size = 28, className, reducedMotion }, ref) => {
    const controls = useIconAnimation(ref, reducedMotion);
    return (
      <svg
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
      >
        <circle cx="12" cy="12" r="10" />
        <motion.polygon
          points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
          initial="normal"
          animate={controls}
          transition={iconTransition}
          variants={{ normal: { rotate: 0 }, animate: { rotate: 25 } }}
        />
      </svg>
    );
  },
);
CompassIcon.displayName = 'CompassIcon';
