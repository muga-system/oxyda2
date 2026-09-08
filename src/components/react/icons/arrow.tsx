import { motion } from 'motion/react';
import { forwardRef } from 'react';
import {
  iconTransition,
  useIconAnimation,
  type AnimatedIconHandle,
  type AnimatedIconProps,
} from './animated-icon';

type Direction = 'right' | 'down' | 'up-right';

const geometry: Record<
  Direction,
  { path: string; animate: { x?: number; y?: number } }
> = {
  right: { path: 'M5 12h14m-6-6 6 6-6 6', animate: { x: 3 } },
  down: { path: 'M12 5v14m-6-6 6 6 6-6', animate: { y: 3 } },
  'up-right': { path: 'M5 19 19 5m0 0H8m11 0v11', animate: { x: 2, y: -2 } },
};

interface DirectionalArrowProps extends AnimatedIconProps {
  direction: Direction;
}

const DirectionalArrow = forwardRef<AnimatedIconHandle, DirectionalArrowProps>(
  ({ direction, size = 20, className, reducedMotion }, ref) => {
    const controls = useIconAnimation(ref, reducedMotion);
    const { path, animate } = geometry[direction];

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
        variants={{ normal: { x: 0, y: 0 }, animate }}
      >
        <path d={path} />
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
