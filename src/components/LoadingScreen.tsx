import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total duration of the loading screen
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Wait for exit animation to finish
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden"
        >
          {/* Cinematic Background Effects */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 flex opacity-40" style={{ transform: 'skewX(-25deg) scale(1.5) translateX(-10%)' }}>
               <div className="w-[10%] h-full bg-gradient-to-r from-[#ff2a00] to-[#800000] blur-3xl" />
               <div className="w-[20%] h-full bg-gradient-to-r from-[#800000] via-[#cc0000] to-[#0a0a0a] blur-3xl" />
               <div className="w-[15%] h-full bg-[#0a0a0a]" />
               <div className="w-[25%] h-full bg-gradient-to-r from-[#0a0a0a] via-[#ff0000] to-[#0a0a0a] blur-3xl" />
               <div className="w-[10%] h-full bg-[#0a0a0a]" />
               <div className="w-[15%] h-full bg-gradient-to-r from-[#0a0a0a] via-[#cc0000] to-[#800000] blur-3xl" />
               <div className="w-[15%] h-full bg-gradient-to-r from-[#800000] to-[#ff0000] blur-3xl" />
            </div>
            
            <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-[100px]" />
            
            <div 
              className="absolute inset-0 opacity-[0.5] mix-blend-overlay pointer-events-none" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-center"
            >
              <motion.h1 
                initial={{ letterSpacing: "0.1em" }}
                animate={{ letterSpacing: "0.3em" }}
                transition={{ duration: 3.5, ease: "easeOut" }}
                className="text-4xl sm:text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 tracking-widest uppercase"
              >
                Sambhasha XXVI
              </motion.h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
              className="mt-8 flex flex-col items-center gap-4"
            >
              <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
              <p className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase">
                Initializing System
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
