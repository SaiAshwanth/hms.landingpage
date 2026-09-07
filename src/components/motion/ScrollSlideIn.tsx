import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface ScrollSlideInProps {
  children: React.ReactNode;
  from?: 'right' | 'left' | 'bottom' | 'top';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

export const ScrollSlideIn: React.FC<ScrollSlideInProps> = ({
  children,
  from = 'right',
  delay = 0,
  duration = 0.75,
  distance = 120,
  className = '',
  once = false,
}) => {
  const getInitialPosition = () => {
    switch (from) {
      case 'right':
        return { x: distance, y: 0 };
      case 'left':
        return { x: -distance, y: 0 };
      case 'bottom':
        return { x: 0, y: distance };
      case 'top':
        return { x: 0, y: -distance };
      default:
        return { x: distance, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: initialPos.x,
      y: initialPos.y,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-12% 0px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
