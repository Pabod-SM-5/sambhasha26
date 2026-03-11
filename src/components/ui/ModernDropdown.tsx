import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModernDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function ModernDropdown({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option',
  className = ''
}: ModernDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs uppercase tracking-wider text-white/40 font-medium mb-1.5 ml-1">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-xl px-4 py-2.5 text-sm text-zinc-50 hover:bg-[#141414] hover:border-red-900/50 transition-all ${isOpen ? 'bg-[#141414] border-red-900/50 ring-1 ring-red-900/50' : ''}`}
      >
        <span className={value ? 'text-white' : 'text-white/40'}>
          {value === 'All' && label ? `All ${label}s` : (value || placeholder)}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute z-[100] w-full mt-2 bg-[#0a0a0a]/90 backdrop-blur-xl border border-red-900/30 rounded-xl shadow-xl shadow-black/50 overflow-hidden py-1"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-[#141414] transition-colors group"
                >
                  <span className={option === value ? 'text-white font-medium' : 'text-white/60 group-hover:text-white/90'}>
                    {option === 'All' && label ? `All ${label}s` : option}
                  </span>
                  {option === value && (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
