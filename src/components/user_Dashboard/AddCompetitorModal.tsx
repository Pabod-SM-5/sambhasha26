import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { validateBirthYear, formatContestantId } from '../../lib/competitionLogic';

interface AddCompetitorModalProps {
  onClose: () => void;
  onAdd: (competitor: any) => void;
}

const AddCompetitorModal: React.FC<AddCompetitorModalProps> = ({ onClose, onAdd }) => {
  // Data State
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [dob, setDob] = useState('');
  const [contact, setContact] = useState('');
  const [nic, setNic] = useState('');
  
  // Processing State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Derived State helpers
  const selectedCategory = categories.find(c => c.id.toString() === selectedCategoryId);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        setCategories(data || []);
    } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load competition categories.");
    } finally {
        setLoadingCats(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    // 1. Basic Validation
    if (!selectedCategory) {
        setErrorMsg("Please select a valid category.");
        setIsSubmitting(false);
        return;
    }

    // 2. Age Validation (Matrix Check)
    const ageCheck = validateBirthYear(dob, selectedCategory.division || 'Open');
    if (!ageCheck.valid) {
        setErrorMsg(ageCheck.error || "Age validation failed.");
        setIsSubmitting(false);
        return;
    }

    try {
        // 3. ID Generation Protocol
        // We use the category code to find the latest sequence number used.
        // We look for the last ID generated for this category (NC-26-XX-%)
        
        const code = selectedCategory.code || '00';
        const idPrefix = `NC-26-${code}-`;

        // Fetch the most recent ID for this prefix to increment safely
        // Use maybeSingle() to handle cases where no competitors exist yet (returns null instead of error)
        const { data: latestCompetitor, error: fetchError } = await supabase
            .from('competitors')
            .select('contest_id')
            .ilike('contest_id', `${idPrefix}%`)
            .order('contest_id', { ascending: false })
            .limit(1)
            .maybeSingle();
        
        if (fetchError) {
             throw fetchError;
        }

        let nextSequence = 1;

        if (latestCompetitor && latestCompetitor.contest_id) {
            // Extract sequence from "NC-26-XX-YYY"
            const parts = latestCompetitor.contest_id.split('-');
            if (parts.length === 4) {
                const lastSeqStr = parts[3];
                const lastSeq = parseInt(lastSeqStr, 10);
                if (!isNaN(lastSeq)) {
                    nextSequence = lastSeq + 1;
                }
            }
        }

        const generatedId = formatContestantId(code, nextSequence);

        // 4. Submit to Parent/DB
        await onAdd({
            name,
            contestId: generatedId, // Auto-generated
            category: selectedCategory.name, // Display Name
            dob,
            contact,
            nic
        });
        
        onClose();

    } catch (err: any) {
        console.error(err);
        setErrorMsg("System error generating ID. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-dark-card border border-neutral-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-dark-900/50 flex-shrink-0">
          <div>
            <h3 className="text-xs font-bold tracking-[0.2em] text-silver-accent uppercase">Register Contestant</h3>
            <p className="text-[10px] text-neutral-500 font-mono mt-1">ID Generation Matrix Active</p>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="text-red-500 flex-shrink-0" size={18} />
                    <p className="text-xs text-red-400 font-medium leading-relaxed">{errorMsg}</p>
                </div>
            )}

            <div className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold ml-1">Contestant's Name</label>
                    <input 
                        required 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full bg-dark-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all placeholder-neutral-600" 
                        placeholder="Full Name (English)" 
                    />
                </div>

                {/* Category Select */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold ml-1">Event Category</label>
                    <div className="relative">
                        <select 
                            required 
                            value={selectedCategoryId} 
                            onChange={e => setSelectedCategoryId(e.target.value)} 
                            className="w-full bg-dark-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all placeholder-neutral-600 appearance-none"
                            disabled={loadingCats}
                        >
                            <option value="" disabled>Select Competition Event</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.code ? `[${cat.code}] ` : ''}{cat.name} ({cat.division || 'Open'})
                                </option>
                            ))}
                        </select>
                        {loadingCats && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-neutral-500" size={16} />}
                    </div>
                </div>

                {/* Dynamic Logic Display */}
                {selectedCategory && (
                    <div className="bg-silver-500/5 border border-silver-500/10 rounded-lg p-3">
                        <div className="flex justify-between items-center text-[10px] font-mono mb-2">
                            <span className="text-neutral-500">CATEGORY CODE:</span>
                            <span className="text-silver-accent font-bold">{selectedCategory.code || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-neutral-500">REQUIRED DOB YEAR:</span>
                            <span className="text-silver-accent font-bold">
                                {/* Display logic based on division */}
                                {selectedCategory.division === 'Junior' && "2011 - 2014"}
                                {selectedCategory.division === 'Intermediate' && "2009 - 2010"}
                                {selectedCategory.division === 'Senior' && "2006 - 2008"}
                                {(selectedCategory.division === 'Open' || !selectedCategory.division) && "2006 - 2014"}
                            </span>
                        </div>
                    </div>
                )}

                {/* DOB */}
                <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold ml-1">Date of Birth</label>
                    <div className="relative">
                        <input 
                            required 
                            type="date" 
                            value={dob} 
                            onChange={e => setDob(e.target.value)} 
                            className="w-full bg-dark-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all placeholder-neutral-600" 
                        />
                        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Contact & NIC */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold ml-1">Contact No</label>
                        <input 
                            type="text" 
                            value={contact} 
                            onChange={e => setContact(e.target.value)} 
                            className="w-full bg-dark-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all placeholder-neutral-600" 
                            placeholder="071 XXXXXXX" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold ml-1">NIC (Optional)</label>
                        <input 
                            type="text" 
                            value={nic} 
                            onChange={e => setNic(e.target.value)} 
                            className="w-full bg-dark-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all placeholder-neutral-600" 
                            placeholder="National ID" 
                        />
                    </div>
                </div>
            </div>

            <div className="pt-2">
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-b from-neutral-200 to-neutral-400 hover:from-white hover:to-neutral-300 text-black px-8 py-3.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-white/5 tracking-widest uppercase border-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={16} /> Verifying & Generating ID...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={16} /> Confirm Registration
                        </>
                    )}
                </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompetitorModal;