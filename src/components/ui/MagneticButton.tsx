import React from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic';
import { Button, type ButtonProps } from './Button';

export const MagneticButton: React.FC<ButtonProps> = (props) => {
  const { ref, position, handleMouseMove, handleMouseLeave } = useMagnetic(0.2);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 250, damping: 15, mass: 0.1 }}
      >
        <Button {...props} />
      </motion.div>
    </div>
  );
};
