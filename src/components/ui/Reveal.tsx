import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface RevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  width = '100%',
  delay = 0,
  direction = 'up',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getVariants = (): Variants => {
    const distance = 24;
    let initialPosition = { x: 0, y: 0 };

    switch (direction) {
      case 'up':
        initialPosition = { x: 0, y: distance };
        break;
      case 'down':
        initialPosition = { x: 0, y: -distance };
        break;
      case 'left':
        initialPosition = { x: distance, y: 0 };
        break;
      case 'right':
        initialPosition = { x: -distance, y: 0 };
        break;
      case 'none':
        initialPosition = { x: 0, y: 0 };
        break;
    }

    return {
      hidden: { opacity: 0, ...initialPosition },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.7,
          delay,
          ease: 'easeOut',
        },
      },
    };
  };

  return (
    <motion.div
      style={{ width }}
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
