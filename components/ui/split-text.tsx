import React from 'react';
import { motion, Variants } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const SplitText: React.FC<SplitTextProps> = ({ text, className = '', delay = 0 }) => {
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      style={{ display: "flex", flexWrap: "wrap", overflow: "visible" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={cn("font-medium tracking-tight", className)}
    >
      {words.map((word, i) => (
        <span key={i} className="flex whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, index) => (
            <motion.span variants={child} key={index}>
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
};

export default SplitText;