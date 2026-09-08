// Adapted from https://github.com/pqoqubbw/icons/blob/main/icons/map-pin.tsx.
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

export const MapPinIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
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
        variants={{ normal: { y: 0 }, animate: { y: -2 } }}
      >
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <motion.circle
          cx="12"
          cy="10"
          r="3"
          initial="normal"
          animate={controls}
          transition={iconTransition}
          variants={{
            normal: { pathLength: 1 },
            animate: { pathLength: [1, 0.4, 1] },
          }}
        />
      </motion.svg>
    );
  },
);
MapPinIcon.displayName = 'MapPinIcon';
