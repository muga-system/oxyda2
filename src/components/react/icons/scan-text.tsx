// Adapted from https://github.com/pqoqubbw/icons/blob/main/icons/scan-text.tsx.
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

export const ScanTextIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
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
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        {['M7 8h8', 'M7 12h10', 'M7 16h6'].map((path, index) => (
          <motion.path
            key={path}
            d={path}
            initial="normal"
            animate={controls}
            transition={{
              ...iconTransition,
              duration: 0.16,
              delay: index * 0.02,
            }}
            variants={{
              normal: { pathLength: 1, opacity: 1 },
              animate: { pathLength: [1, 0.4, 1], opacity: [1, 0.5, 1] },
            }}
          />
        ))}
      </svg>
    );
  },
);
ScanTextIcon.displayName = 'ScanTextIcon';
