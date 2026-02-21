import React, { useState } from 'react';
import { ArrowRight, Building2, User, Lock, AlertCircle, Loader2, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AuthLayout from './AuthLayout';
import PasswordCriteria from './PasswordCriteria';
import { 
  validatePassword, 
  validateEmail, 
  validateSchoolName, 
  validatePhone,
  validateName,
  validateAddress,
  validateDistrict 
} from '../lib/validators';
import { rateLimiter, rateLimits } from '../lib/rateLimiter';
import { secureLogger } from '../lib/secureLogs';

const RegisterScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<{ showed: boolean; email: string }>({ showed: false, email: '' });
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    schoolName: '',
    district: '',
    phone: '',
    address: '',
    ticName: '',
    ticContact: '',
    coordinatorName: '',
    coordinatorContact: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // ========== SECURITY: RATE LIMITING ==========
      const rateLimit = rateLimits.registration(formData.email);
      if (!rateLimiter.isAllowed(rateLimit.key, rateLimit.maxAttempts, rateLimit.windowMs)) {
        const secondsRemaining = rateLimiter.getSecondsUntilReset(rateLimit.key);
        setErrorMsg(`Too many registration attempts. Please try again in ${secondsRemaining} seconds.`);
        setIsLoading(false);
        return;
      }

      // ========== VALIDATION: PASSWORDS ==========
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        setErrorMsg(passwordValidation.error || 'Password validation failed');
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // ========== VALIDATION: EMAIL ==========
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.valid) {
        setErrorMsg(emailValidation.error || 'Email validation failed');
        setIsLoading(false);
        return;
      }

      // ========== VALIDATION: SCHOOL DETAILS ==========
      const schoolNameValidation = validateSchoolName(formData.schoolName);
      if (!schoolNameValidation.valid) {
        setErrorMsg(schoolNameValidation.error || 'School name validation failed');
        setIsLoading(false);
        return;
      }

      const districtValidation = validateDistrict(formData.district);
      if (!districtValidation.valid) {
        setErrorMsg(districtValidation.error || 'District validation failed');
        setIsLoading(false);
        return;
      }

      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.valid) {
        setErrorMsg(phoneValidation.error || 'Phone number validation failed');
        setIsLoading(false);
        return;
      }

      const addressValidation = validateAddress(formData.address);
      if (!addressValidation.valid) {
        setErrorMsg(addressValidation.error || 'Address validation failed');
        setIsLoading(false);
        return;
      }

      // ========== VALIDATION: PROFESSIONAL DETAILS ==========
      const ticNameValidation = validateName(formData.ticName, 'Teacher-in-Charge Name');
      if (!ticNameValidation.valid) {
        setErrorMsg(ticNameValidation.error || 'TIC name validation failed');
        setIsLoading(false);
        return;
      }

      const ticContactValidation = validatePhone(formData.ticContact);
      if (!ticContactValidation.valid) {
        setErrorMsg('TIC contact must be a valid phone number');
        setIsLoading(false);
        return;
      }

      const coordinatorNameValidation = validateName(formData.coordinatorName, 'Coordinator Name');
      if (!coordinatorNameValidation.valid) {
        setErrorMsg(coordinatorNameValidation.error || 'Coordinator name validation failed');
        setIsLoading(false);
        return;
      }

      const coordinatorContactValidation = validatePhone(formData.coordinatorContact);
      if (!coordinatorContactValidation.valid) {
        setErrorMsg('Coordinator contact must be a valid phone number');
        setIsLoading(false);
        return;
      }

      // ========== DATABASE: CHECK IF EMAIL EXISTS ==========
      // Note: This reveals user existence, but is necessary for good UX
      // In production, consider constant-time comparison or delayed response
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingProfile) {
        setErrorMsg("An account with this email already exists. Please sign in instead.");
        secureLogger.warn('Registration attempted with existing email', { email: formData.email });
        setIsLoading(false);
        return;
      }

      // ========== AUTHENTICATION: SIGN UP ==========
      const { data: { user, session }, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                school_name: formData.schoolName,
                district: formData.district,
                phone: formData.phone,
                address: formData.address,
                tic_name: formData.ticName,
                tic_contact: formData.ticContact,
                coordinator_name: formData.coordinatorName,
                coordinator_contact: formData.coordinatorContact,
                role: 'user'
            }
        }
      });

      if (authError) {
        // Generic error messages to prevent information disclosure
        if (authError.status === 429) {
           setErrorMsg("Server is temporarily busy. Please try again in a few minutes.");
        } else if (authError.message.includes('rate limit')) {
           setErrorMsg("Too many registration attempts. Please try again later.");
        } else if (authError.message.includes('already registered')) {
           setErrorMsg("This email is already registered. Please sign in instead.");
        } else {
           setErrorMsg("Registration failed. Please try again or contact support.");
        }
        
        secureLogger.error('Registration authentication error', { status: authError.status });
        setIsLoading(false);
        return;
      }

      if (user) {
        // ========== SUCCESS FLOW ==========
        if (!session) {
            // Email verification required
            setSuccessState({ 
                showed: true, 
                email: formData.email
            });
            secureLogger.info('User registered successfully - email verification pending', { userId: user.id });
        } else {
            // Auto-login
            navigate('/user');
            secureLogger.info('User registered and automatically logged in', { userId: user.id });
        }
      }
    } catch (error: any) {
      secureLogger.error('Unexpected registration error', { errorType: error?.name });
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // SUCCESS STATE VIEW
  if (successState.showed) {
    return (
      <AuthLayout
        title="Registration Successful"
        subtitle="Verify your email to continue"
        maxWidth="max-w-xl"
      >
        <div className="flex flex-col items-center text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 mb-2 animate-zoom-in">
                <Mail size={40} className="text-green-500" />
            </div>
            
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Check your Inbox</h3>
                <p className="text-neutral-400 text-sm max-w-sm mx-auto leading-relaxed">
                    We have sent a verification link to <span className="text-silver-accent font-semibold">{successState.email}</span>. 
                    Please click the link to activate your school's account.
                </p>
            </div>

            <button 
                onClick={() => navigate('/login')}
                className="mt-6 px-8 py-3 bg-neutral-100 hover:bg-white text-black font-bold text-sm tracking-widest uppercase rounded-xl transition-all shadow-lg hover:shadow-white/10 cursor-pointer"
            >
                Return to Login
            </button>
        </div>
      </AuthLayout>
    );
  }

  // FORM VIEW
  return (
    <AuthLayout
      title="School Registration"
      subtitle="Official Entry Portal for Sambhasha XXVI"
      maxWidth="max-w-3xl"
      footer={
        <p className="text-sm text-neutral-500">
          Already registered? <Link to="/login" className="text-silver-accent hover:text-white font-medium transition-colors cursor-pointer">Access Portal</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 text-red-400 text-xs font-medium animate-in fade-in">
             <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
             <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* SECTION 1: SCHOOL DETAILS */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-silver-accent border-b border-white/5 pb-2">
              <Building2 size={16} />
              <h3 className="text-xs font-bold tracking-widest uppercase">School Details</h3>
          </div>

          <div className="space-y-6">
              <InputGroup label="School Name" placeholder="e.g. Nalanda College" value={formData.schoolName} onChange={(v) => handleChange('schoolName', v)} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="District" placeholder="e.g. Colombo" value={formData.district} onChange={(v) => handleChange('district', v)} />
                  <InputGroup label="Official Phone" placeholder="011 2 123 456" value={formData.phone} onChange={(v) => handleChange('phone', v)} />
              </div>

              <InputGroup label="Address" placeholder="School Address" value={formData.address} onChange={(v) => handleChange('address', v)} />
          </div>
        </div>

        {/* SECTION 2: PROFESSIONAL DETAILS */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-silver-accent border-b border-white/5 pb-2">
              <User size={16} />
              <h3 className="text-xs font-bold tracking-widest uppercase">Professional Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="Teacher-in-Charge Name" placeholder="Mr./Mrs. Name" value={formData.ticName} onChange={(v) => handleChange('ticName', v)} />
              <InputGroup label="TIC Contact" placeholder="Mobile Number" value={formData.ticContact} onChange={(v) => handleChange('ticContact', v)} />
              
              <InputGroup label="Coordinator Name" placeholder="Student Name" value={formData.coordinatorName} onChange={(v) => handleChange('coordinatorName', v)} />
              <InputGroup label="Coordinator Contact" placeholder="Mobile Number" value={formData.coordinatorContact} onChange={(v) => handleChange('coordinatorContact', v)} />
          </div>
        </div>

        {/* SECTION 3: ACCOUNT SECURITY */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-silver-accent border-b border-white/5 pb-2">
              <Lock size={16} />
              <h3 className="text-xs font-bold tracking-widest uppercase">Account Security</h3>
          </div>

          <div className="space-y-6">
              <InputGroup label="Email" placeholder="mediaunit@school.lk" type="email" value={formData.email} onChange={(v) => handleChange('email', v)} />
              
              <div className="space-y-4">
                  <PasswordCriteria password={formData.password} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup label="Password" placeholder="••••••••" type="password" value={formData.password} onChange={(v) => handleChange('password', v)} />
                      <InputGroup label="Confirm Password" placeholder="••••••••" type="password" value={formData.confirmPassword} onChange={(v) => handleChange('confirmPassword', v)} />
                  </div>
              </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full group relative overflow-hidden rounded-xl border border-silver-500 text-silver-accent p-4 transition-all hover:bg-silver-300 hover:text-black active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-4 cursor-pointer"
        >
            <div className="relative z-10 flex items-center justify-center space-x-2">
              {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span className="text-sm font-bold tracking-widest uppercase">Creating Account...</span>
                  </>
              ) : (
                  <>
                    <span className="text-sm font-bold tracking-widest uppercase">Create Official Account</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
              )}
            </div>
        </button>

      </form>
    </AuthLayout>
  );
};

const InputGroup: React.FC<{ label: string; placeholder: string; type?: string; value: string; onChange: (val: string) => void }> = ({ label, placeholder, type = "text", value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold ml-1 block">
            {label}
        </label>
        <input 
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-dark-900/50 border border-neutral-800 rounded-lg px-4 py-3.5 text-sm text-neutral-200 placeholder-neutral-700 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all duration-300"
            required
        />
    </div>
);

export default RegisterScreen;