import { useAnimation } from 'motion/react';
import { useEffect, useImperativeHandle, type ForwardedRef } from 'react';

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface AnimatedIconProps {
  size?: number;
  className?: string;
  reducedMotion?: boolean;
}

export const iconTransition = {
  type: 'tween',
  duration: 0.2,
  ease: 'easeOut',
} as const;

export function useIconAnimation(
  ref: ForwardedRef<AnimatedIconHandle>,
  reducedMotion = false,
) {
  const controls = useAnimation();

  useImperativeHandle(
    ref,
    () => ({
      startAnimation: () => {
        if (!reducedMotion) void controls.start('animate');
      },
      stopAnimation: () => {
        void controls.start('normal');
      },
    }),
    [controls, reducedMotion],
  );

  useEffect(() => {
    if (reducedMotion) {
      controls.stop();
      controls.set('normal');
    }
    return () => controls.stop();
  }, [controls, reducedMotion]);

  return controls;
}
