import React from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  delay?: number;
  stagger?: number;
  mode?: 'words' | 'chars';
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  as: Component = 'h2',
  delay = 0,
  stagger = 0.04,
  mode = 'words',
}) => {
  const ref = React.useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  const items = mode === 'words' ? text.split(' ') : text.split('');

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 24,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
      },
    },
  };

  const MotionComponent = motion[Component] as typeof motion.h2;

  return (
    <MotionComponent
      ref={ref}
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {items.map((item, index) => (
        <motion.span key={index} variants={itemVariants} className="inline-block">
          {item}
        </motion.span>
      ))}
    </MotionComponent>
  );
};
