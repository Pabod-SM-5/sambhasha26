import React from 'react';
import { motion } from 'motion/react';

export default function RulesHeader() {
  return (
    <div className="text-center space-y-4 mb-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight"
      >
        Rules & Regulations
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-white/40 max-w-2xl mx-auto text-sm md:text-base"
      >
        Please read the following guidelines carefully to ensure a fair and successful competition experience.
      </motion.p>
    </div>
  );
}
