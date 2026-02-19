import React, { useState } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { logSystemAction } from '../../lib/logger';

interface LogoUploadModalProps {
  onUploadSuccess: () => void;
}

const LogoUploadModal: React.FC<LogoUploadModalProps> = ({ onUploadSuccess }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate size (1MB)
      if (selectedFile.size > 1 * 1024 * 1024) {
        setErrorMsg("File size must be less than 1MB");
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrorMsg(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    
    setUploading(true);
    setErrorMsg(null);

    try {
        const userId = user.id;
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
        const fileName = `${userId}.${fileExt}`; // Strict naming

        // 1. Upload to Storage (Upsert overwrites existing file)
        const { error: uploadError } = await supabase.storage
            .from('school_logos')
            .upload(fileName, file, {
                upsert: true,
                cacheControl: '0' // Try to prevent CDN caching
            });

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: urlData } = supabase.storage
            .from('school_logos')
            .getPublicUrl(fileName);

        if (!urlData.publicUrl) throw new Error("Failed to retrieve public URL");

        // 3. Append timestamp to force cache bust on clients
        const timestamp = new Date().getTime();
        const publicUrlWithTimestamp = `${urlData.publicUrl}?t=${timestamp}`;

        // 4. Update Profile
        const { error: dbError } = await supabase
            .from('profiles')
            .update({ logo_url: publicUrlWithTimestamp })
            .eq('id', userId);

        if (dbError) throw dbError;

        // 5. Log Action
        await logSystemAction('LOGO_UPLOAD', 'User uploaded a new school logo');

        // 6. Success
        onUploadSuccess();

    } catch (error: any) {
        console.error("Upload failed:", error);
        setErrorMsg(error.message || "Failed to upload logo.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Heavy Blur Backdrop - Blocking interaction */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      
      {/* Modal Content */}
      <div className="relative z-[101] bg-dark-card border border-neutral-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-zoom-in">
        
        <div className="p-8 text-center space-y-6">
            <div className="space-y-2">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                    <Upload size={32} className="text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Setup Required</h2>
                <p className="text-sm text-neutral-400 max-w-xs mx-auto">
                    To complete your school profile, you must upload your official School Crest/Logo.
                </p>
            </div>

            {/* Upload Area */}
            <div className="relative group cursor-pointer">
                 <div className={`w-40 h-40 mx-auto rounded-xl bg-dark-900 border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${errorMsg ? 'border-red-500/50 bg-red-500/5' : 'border-neutral-700 group-hover:border-silver-accent'}`}>
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center p-4">
                            <Upload size={24} className="text-neutral-500 mx-auto mb-2" />
                            <p className="text-[10px] text-neutral-500 uppercase font-bold">Click to Upload</p>
                        </div>
                    )}
                 </div>
                 <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                 />
            </div>

            {errorMsg && (
                <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-medium bg-red-500/10 py-2 rounded-lg">
                    <AlertCircle size={14} /> {errorMsg}
                </div>
            )}

            <div className="space-y-3">
                <button 
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full py-3.5 bg-silver-accent hover:bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin" size={16} /> Uploading...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={16} /> Complete Setup
                        </>
                    )}
                </button>
                
                <p className="text-[10px] text-neutral-600 uppercase tracking-wider font-medium">
                    This step is mandatory
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default LogoUploadModal;