import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UploadCloud, Link as LinkIcon, CheckCircle2, AlertCircle, FileText, Users } from 'lucide-react';

// Mock Data
const SUBMISSION_CATEGORIES = [
  "Graphic Design",
  "Short Film",
  "Photography",
  "Digital Art"
];

const CONTESTANTS = [
  { id: "SB-26-005", name: "Sahan Fernando" },
  { id: "SB-26-007", name: "Kavindu Bandara" },
  { id: "SB-26-012", name: "Tharindu Jayasuriya" },
];

export default function Submissions() {
  const [formData, setFormData] = useState({
    category: "",
    contestant: "",
    driveLink: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Reset after showing success
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ category: "", contestant: "", driveLink: "" });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-serif font-medium text-white tracking-tight">Digital Submissions</h1>
        <p className="text-white/40 text-sm">Submit your digital creations for Sambhasha XXVI</p>
      </div>

      {/* Submission Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 relative overflow-hidden"
      >
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-950/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono pl-1">
              Select Category
            </label>
            <div className="relative">
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-[#141414]/50 border border-red-900/30 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled className="text-white/30">Choose a category...</option>
                {SUBMISSION_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                <FileText className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Contestant Selection */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono pl-1">
              Select Contestant
            </label>
            <div className="relative">
              <select
                required
                value={formData.contestant}
                onChange={(e) => setFormData({...formData, contestant: e.target.value})}
                className="w-full bg-[#141414]/50 border border-red-900/30 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Choose a contestant...</option>
                {CONTESTANTS.map(contestant => (
                  <option key={contestant.id} value={contestant.id} className="bg-[#1a1a1a]">
                    {contestant.name} ({contestant.id})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                <Users className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Drive Link Input */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono pl-1">
              Google Drive Link
            </label>
            <div className="relative group">
              <input
                type="url"
                required
                placeholder="https://drive.google.com/..."
                value={formData.driveLink}
                onChange={(e) => setFormData({...formData, driveLink: e.target.value})}
                className="w-full bg-[#141414]/50 border border-red-900/30 rounded-xl px-4 py-3.5 pl-11 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/60 transition-colors">
                <LinkIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[10px] text-white/30 pl-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Ensure the link has "Anyone with the link" access enabled.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || submitted}
            className={`w-full relative overflow-hidden rounded-xl py-4 px-6 flex items-center justify-center space-x-2 transition-all duration-300 outline-none focus:outline-none ${
              submitted 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-[#141414] hover:bg-[#1a1a1a] border border-red-900/30 text-white'
            }`}
          >
            {submitted ? (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium tracking-wide">Submission Received</span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-5 h-5 text-white/60" />
                )}
                <span className="font-medium tracking-wide uppercase text-xs">
                  {isSubmitting ? 'Submitting...' : 'Submit Entry'}
                </span>
              </div>
            )}
          </button>

        </form>
      </motion.div>

      {/* Instructions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#0a0a0a]/50 border border-red-900/30 rounded-xl p-4">
          <h3 className="text-xs font-medium text-white/80 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            File Naming
          </h3>
          <p className="text-[10px] text-white/40 leading-relaxed">
            Please rename your files as: <br/>
            <code className="bg-zinc-950/5 px-1 py-0.5 rounded text-white/60">Category_School_ContestantName</code>
          </p>
        </div>
        <div className="bg-[#0a0a0a]/50 border border-red-900/30 rounded-xl p-4">
          <h3 className="text-xs font-medium text-white/80 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Deadline
          </h3>
          <p className="text-[10px] text-white/40 leading-relaxed">
            All digital submissions must be uploaded before <br/>
            <span className="text-white/60">October 15th, 2026 at 11:59 PM</span>
          </p>
        </div>
      </div>
    </div>
  );
}
