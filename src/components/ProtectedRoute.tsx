import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'admin' | 'user'; // (optional, if null allow any auth user)
}

/**
 * ProtectedRoute Component
 * 
 * CRITICAL SECURITY NOTES:
 * This component provides CLIENT-SIDE ACCESS CONTROL ONLY.
 * It can be bypassed by:
 * - Browser DevTools (modify storage)
 * - Network interception (modify JWT)
 * - Direct API calls (bypass frontend)
 * 
 * BACKEND VERIFICATION IS MANDATORY:
 * 1. Verify JWT validity and signature on every request
 * 2. Check user role via Supabase RLS (Row Level Security) policies
 * 3. Verify resource ownership before allowing modifications
 * 4. Audit all sensitive operations server-side
 * 5. Use RPC functions with authorization checks
 * 
 * NEVER assume role validity from frontend data.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-silver-accent" size={48} />
      </div>
    );
  }

  // ========== CHECK AUTHENTICATION ==========
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ========== CHECK AUTHORIZATION (FRONTEND ONLY - NOT SECURE FOR PRODUCTION) ==========
  if (allowedRole && role !== allowedRole) {
    // Redirect logic: if admin tries to go to user page -> admin dash, and vice versa
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'user') return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;