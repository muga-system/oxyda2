import { motion } from 'motion/react';
import { forwardRef } from 'react';
import {
  useIconAnimation,
  type AnimatedIconHandle,
  type AnimatedIconProps,
} from './animated-icon';

export const CircleCheckIcon = forwardRef<
  AnimatedIconHandle,
  AnimatedIconProps
>(({ size = 28, className, reducedMotion }, ref) => {
  const controls = useIconAnimation(ref, reducedMotion);

  return (
    <motion.svg
      aria-hidden="true"
      focusable="false"
      className={className}
      animate={controls}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      transition={{ duration: 0.5, bounce: 0.2 }}
      variants={{
        normal: { scale: 1, rotate: 0 },
        animate: { scale: [1, 1.08, 1], rotate: [0, -4, 0] },
      }}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.6 2.6L16.5 9" />
    </motion.svg>
  );
});

CircleCheckIcon.displayName = 'CircleCheckIcon';
