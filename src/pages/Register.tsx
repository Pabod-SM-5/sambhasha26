import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import SchoolDetails from '../components/register/SchoolDetails';
import ProfessionalDetails from '../components/register/ProfessionalDetails';
import AccountSecurity from '../components/register/AccountSecurity';

export default function Register() {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  // Calculate password strength
  React.useEffect(() => {
    let s = 0;
    if (password.length >= 12) s += 25;
    if (/[A-Z]/.test(password)) s += 25;
    if (/[0-9]/.test(password)) s += 25;
    if (/[^A-Za-z0-9]/.test(password)) s += 25;
    setStrength(s);
  }, [password]);

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="w-full mb-6 sm:mb-8 flex items-center justify-between px-2 sm:px-0">
        <Link to="/" className="inline-block group">
          <img 
            src="https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/NCCU%20Bottom%20English.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL05DQ1UgQm90dG9tIEVuZ2xpc2guUE5HIiwiaWF0IjoxNzczMjQ5MTA3LCJleHAiOjE4MDQ3ODUxMDd9.eVacVEjbxF51wpA-bRS-aFWfE3zG9If1JR4xHVbW7e8" 
            alt="NCCU Logo" 
            className="w-24 h-auto md:w-32 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Registration Portal</p>
          <p className="text-sm text-zinc-200 font-mono">26th Edition</p>
        </div>
      </div>

      <div 
        className="w-full bg-black/60 border border-red-900/30 rounded-2xl overflow-hidden backdrop-blur-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Side - Info Panel */}
          <div className="lg:col-span-4 bg-black/40 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-red-900/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-overlay" />
            
            <div className="relative z-10">
              <h2 className="text-2xl lg:text-3xl font-serif font-medium text-zinc-50 mb-4 leading-tight">
                Join the Legacy of Excellence
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                Register your school for Sambhasha XXVI. Please ensure all details are accurate as they will be used for official certificates and correspondence.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border border-red-900/30">
                    <span className="font-mono text-xs">01</span>
                  </div>
                  <span>School Information</span>
                </div>
                <div className="w-0.5 h-4 bg-red-900/30 ml-4" />
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border border-red-900/30">
                    <span className="font-mono text-xs">02</span>
                  </div>
                  <span>TIC Details</span>
                </div>
                <div className="w-0.5 h-4 bg-red-900/30 ml-4" />
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center border border-red-900/30">
                    <span className="font-mono text-xs">03</span>
                  </div>
                  <span>Account Security</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-12 lg:mt-0">
              <div className="p-4 rounded-xl bg-black/50 border border-red-900/30 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-zinc-200 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-zinc-50 mb-1">Need Help?</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Contact our support team for assistance with the registration process.
                      <br />
                      <span className="text-zinc-300 mt-1 block font-mono">support@sambhasha.lk</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-8 p-6 sm:p-8 lg:p-10 bg-transparent">
            <form className="space-y-8">
              
              {/* School Details Section */}
              <SchoolDetails />

              {/* Professional Details Section */}
              <ProfessionalDetails />

              {/* Account Security Section */}
              <AccountSecurity 
                password={password} 
                setPassword={setPassword} 
                strength={strength} 
              />

              {/* Form Actions */}
              <div className="pt-6 border-t border-red-900/30 flex items-center justify-between">
                <Link to="/login" className="text-xs text-zinc-400 hover:text-zinc-50 transition-colors">
                  Already registered? Login here
                </Link>
                <button 
                  type="button"
                  className="px-6 py-2.5 sm:px-8 sm:py-3 relative overflow-hidden bg-[#0a0a0a] text-zinc-300 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-xs hover:bg-[#141414] hover:text-zinc-100 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                >
                  <div 
                    className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Complete Registration
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
