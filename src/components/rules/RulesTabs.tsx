import React from 'react';

interface RulesTabsProps {
  activeTab: 'rules' | 'downloads';
  setActiveTab: (tab: 'rules' | 'downloads') => void;
}

export default function RulesTabs({ activeTab, setActiveTab }: RulesTabsProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-[#0a0a0a]/50 p-1 rounded-xl flex items-center gap-1 border border-red-900/30">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 outline-none focus:outline-none ${
            activeTab === 'rules' 
              ? 'bg-[#141414] text-white border border-red-900/30 shadow-lg shadow-black/50' 
              : 'text-white/60 hover:text-white hover:bg-[#141414]/50 border border-transparent'
          }`}
        >
          General Rules
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 outline-none focus:outline-none ${
            activeTab === 'downloads' 
              ? 'bg-[#141414] text-white border border-red-900/30 shadow-lg shadow-black/50' 
              : 'text-white/60 hover:text-white hover:bg-[#141414]/50 border border-transparent'
          }`}
        >
          Complete Guidelines
        </button>
      </div>
    </div>
  );
}
