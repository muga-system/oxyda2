// Source: https://lucide-animated.com/r/scan-text.json
import { motion, useAnimation } from 'motion/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { AnimatedIconHandle, AnimatedIconProps } from './animated-icon';

const FRAME_VARIANTS = {
  visible: { opacity: 1 },
  hidden: { opacity: 1 },
};

const LINE_VARIANTS = {
  visible: { pathLength: 1, opacity: 1 },
  hidden: { pathLength: 0, opacity: 0 },
};

export const ScanTextIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  ({ size = 28, className, reducedMotion }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    async function startAnimation() {
      if (reducedMotion) return;
      await controls.start((index) => ({
        pathLength: 0,
        opacity: 0,
        transition: { delay: Number(index) * 0.1, duration: 0.3 },
      }));
      await controls.start((index) => ({
        pathLength: 1,
        opacity: 1,
        transition: { delay: Number(index) * 0.1, duration: 0.3 },
      }));
    }

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation,
        stopAnimation: () => {
          void controls.start('visible');
        },
      };
    }, [controls, reducedMotion]);

    return (
      <svg
        aria-hidden="true"
        focusable="false"
        className={className}
        fill="none"
        height={size}
        onMouseEnter={() => {
          if (!isControlledRef.current) void startAnimation();
        }}
        onMouseLeave={() => {
          if (!isControlledRef.current) void controls.start('visible');
        }}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path d="M3 7V5a2 2 0 0 1 2-2h2" variants={FRAME_VARIANTS} />
        <motion.path d="M17 3h2a2 2 0 0 1 2 2v2" variants={FRAME_VARIANTS} />
        <motion.path d="M21 17v2a2 2 0 0 1-2 2h-2" variants={FRAME_VARIANTS} />
        <motion.path d="M7 21H5a2 2 0 0 1-2-2v-2" variants={FRAME_VARIANTS} />
        <motion.path
          animate={controls}
          custom={0}
          d="M7 8h8"
          initial="visible"
          variants={LINE_VARIANTS}
        />
        <motion.path
          animate={controls}
          custom={1}
          d="M7 12h10"
          initial="visible"
          variants={LINE_VARIANTS}
        />
        <motion.path
          animate={controls}
          custom={2}
          d="M7 16h6"
          initial="visible"
          variants={LINE_VARIANTS}
        />
      </svg>
    );
  },
);

ScanTextIcon.displayName = 'ScanTextIcon';
