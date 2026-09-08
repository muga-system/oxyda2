// Sources: https://lucide-animated.com/r/arrow-right.json,
// https://lucide-animated.com/r/arrow-up-right.json,
// https://lucide-animated.com/r/arrow-down.json
import type { Variants } from 'motion/react';
import { motion } from 'motion/react';
import { forwardRef } from 'react';
import {
  useIconAnimation,
  type AnimatedIconHandle,
  type AnimatedIconProps,
} from './animated-icon';

type Direction = 'right' | 'down' | 'up-right';

const rightLineVariants: Variants = {
  normal: { d: 'M5 12h14' },
  animate: {
    d: ['M5 12h14', 'M5 12h9', 'M5 12h14'],
    transition: { duration: 0.4 },
  },
};

const rightHeadVariants: Variants = {
  normal: { d: 'm12 5 7 7-7 7', translateX: 0 },
  animate: {
    d: 'm12 5 7 7-7 7',
    translateX: [0, -3, 0],
    transition: { duration: 0.4 },
  },
};

const downHeadVariants: Variants = {
  normal: { d: 'm19 12-7 7-7-7', translateY: 0 },
  animate: {
    d: 'm19 12-7 7-7-7',
    translateY: [0, -3, 0],
    transition: { duration: 0.4 },
  },
};

const downLineVariants: Variants = {
  normal: { d: 'M12 5v14' },
  animate: {
    d: ['M12 5v14', 'M12 5v9', 'M12 5v14'],
    transition: { duration: 0.4 },
  },
};

const upRightVariants: Variants = {
  normal: { scale: 1, translateX: 0, translateY: 0 },
  animate: {
    scale: [1, 0.85, 1],
    translateX: [0, -4, 0],
    translateY: [0, 4, 0],
    originX: 1,
    originY: 0,
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

interface DirectionalArrowProps extends AnimatedIconProps {
  direction: Direction;
}

const DirectionalArrow = forwardRef<AnimatedIconHandle, DirectionalArrowProps>(
  ({ direction, size = 20, className, reducedMotion }, ref) => {
    const controls = useIconAnimation(ref, reducedMotion);

    return (
      <motion.svg
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
        {direction === 'right' && (
          <>
            <motion.path
              animate={controls}
              d="M5 12h14"
              variants={rightLineVariants}
            />
            <motion.path
              animate={controls}
              d="m12 5 7 7-7 7"
              variants={rightHeadVariants}
            />
          </>
        )}
        {direction === 'down' && (
          <>
            <motion.path
              animate={controls}
              d="m19 12-7 7-7-7"
              variants={downHeadVariants}
            />
            <motion.path
              animate={controls}
              d="M12 5v14"
              variants={downLineVariants}
            />
          </>
        )}
        {direction === 'up-right' && (
          <motion.g animate={controls} variants={upRightVariants}>
            <path d="M7 7H17" />
            <path d="M17 7V17" />
            <path d="M7 17L17 7" />
          </motion.g>
        )}
      </motion.svg>
    );
  },
);

export const ArrowRightIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (props, ref) => <DirectionalArrow {...props} ref={ref} direction="right" />,
);

export const ArrowDownIcon = forwardRef<AnimatedIconHandle, AnimatedIconProps>(
  (props, ref) => <DirectionalArrow {...props} ref={ref} direction="down" />,
);

export const ArrowUpRightIcon = forwardRef<
  AnimatedIconHandle,
  AnimatedIconProps
>((props, ref) => (
  <DirectionalArrow {...props} ref={ref} direction="up-right" />
));

DirectionalArrow.displayName = 'DirectionalArrow';
ArrowRightIcon.displayName = 'ArrowRightIcon';
ArrowDownIcon.displayName = 'ArrowDownIcon';
ArrowUpRightIcon.displayName = 'ArrowUpRightIcon';
