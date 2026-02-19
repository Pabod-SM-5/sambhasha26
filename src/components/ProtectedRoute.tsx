import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: string; // 'admin' or 'user' (optional, if null allow any auth user)
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-silver-accent" size={48} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect logic: if admin tries to go to user page -> admin dash, and vice versa
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'user') return <Navigate to="/user" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;