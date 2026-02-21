import React, { useMemo } from 'react';
import { Lock } from 'lucide-react';

interface PasswordCriteriasProps {
  password: string;
}

interface Criterion {
  name: string;
  regex: RegExp;
}

const PasswordCriteria: React.FC<PasswordCriteriasProps> = ({ password }) => {
  const criteria: Criterion[] = [
    {
      name: 'At least 12 characters',
      regex: /.{12,}/,
    },
    {
      name: 'At least 1 uppercase letter',
      regex: /[A-Z]/,
    },
    {
      name: 'At least 1 number',
      regex: /[0-9]/,
    },
    {
      name: 'At least 1 special character (!@#$%^&*)',
      regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    },
  ];

  const metCriteria = useMemo(() => {
    return criteria.map(criterion => ({
      ...criterion,
      met: criterion.regex.test(password),
    }));
  }, [password]);

  const completionPercentage = useMemo(() => {
    const metCount = metCriteria.filter(c => c.met).length;
    return (metCount / criteria.length) * 100;
  }, [metCriteria]);

  const getProgressColor = (percentage: number): string => {
    if (percentage === 0) return 'bg-gradient-to-r from-red-500 to-red-500';
    if (percentage < 50) return 'bg-gradient-to-r from-red-500 to-yellow-500';
    if (percentage < 100) return 'bg-gradient-to-r from-yellow-500 to-blue-500';
    return 'bg-gradient-to-r from-blue-500 to-green-500';
  };

  const getTextColor = (percentage: number): string => {
    if (percentage === 0) return 'text-neutral-500';
    if (percentage < 50) return 'text-red-400';
    if (percentage < 100) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-3">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold flex items-center gap-1">
            <Lock size={12} />
            Password Strength
          </label>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${getTextColor(completionPercentage)}`}>
            {Math.round(completionPercentage)}%
          </span>
        </div>
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor(completionPercentage)}`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Criteria List */}
      <div className="space-y-1.5 bg-dark-900/30 rounded-lg p-3 border border-neutral-800/50">
        {metCriteria.map((criterion, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-[11px] transition-colors duration-200"
          >
            <div
              className={`w-3.5 h-3.5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                criterion.met
                  ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                  : 'bg-neutral-800/50 border border-neutral-700 text-neutral-600'
              }`}
            >
              {criterion.met ? '✓' : '○'}
            </div>
            <span
              className={`${
                criterion.met
                  ? 'text-green-400/80'
                  : 'text-neutral-500'
              }`}
            >
              {criterion.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordCriteria;
