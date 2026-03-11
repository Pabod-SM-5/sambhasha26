import React from 'react';
import { Shield, AlertCircle, CheckCircle2, Clock, UserCheck, Users } from 'lucide-react';

export default function GeneralRules() {
  const generalRules = [
    {
      icon: <Clock className="w-5 h-5 text-white/60" />,
      text: "Every competitor should be present at the school premises before 7.00 a.m."
    },
    {
      icon: <UserCheck className="w-5 h-5 text-white/60" />,
      text: "All contestants must register for SAMBHASHA'23 through the official website. The school Co-Ordinator has to register the school and the contestants."
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-white/60" />,
      text: "All competitors must be born on or after 01/02/2004."
    },
    {
      icon: <Shield className="w-5 h-5 text-white/60" />,
      text: "Contestants for the senior category should produce the NIC or any valid form of Identification (Ex: Passport, Postal ID)."
    },
    {
      icon: <Users className="w-5 h-5 text-white/60" />,
      text: "Only two contestants can participate in a single category representing a school."
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-white/60" />,
      text: "A contestant can participate only in one category (except the short film category)."
    },
    {
      icon: <Shield className="w-5 h-5 text-white/60" />,
      text: "All contestants should always act according to the rules & regulations of SAMBHASHA'23 and maintain better discipline."
    },
    {
      icon: <UserCheck className="w-5 h-5 text-white/60" />,
      text: "Each and every contestant must be in standard school uniform."
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-white/60" />,
      text: "Lunch will not be provided."
    },
    {
      icon: <Shield className="w-5 h-5 text-white/60" />,
      text: "The decision of the respective judge panel is final and no objections will be allowed."
    }
  ];

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#141414] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <h2 className="text-xl font-serif font-medium text-white mb-6 flex items-center gap-3 relative z-10">
        <Shield className="w-5 h-5 text-white/80" />
        General Guidelines
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
        {generalRules.map((rule, index) => (
          <div 
            key={index}
            className="flex items-start gap-4 p-4 rounded-xl bg-[#141414]/50 border border-red-900/30 hover:bg-[#141414] transition-colors group"
          >
            <div className="flex-shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
              {rule.icon}
            </div>
            <p className="text-sm text-white/60 group-hover:text-white/80 leading-relaxed transition-colors">
              {rule.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
