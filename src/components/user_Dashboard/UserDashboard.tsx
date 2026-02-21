import React, { useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import CompetitorTable from './CompetitorTable';
import CategoryList from './CategoryList';
import SettingsModal from './SettingsModal';
import LogoUploadModal from './LogoUploadModal';
import ErrorBoundary from '../ErrorBoundary';
import { useAuth } from '../../contexts/AuthContext';
import { logSystemAction } from '../../lib/logger';
import { secureLogger } from '../../lib/secureLogs';

const UserDashboard: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut, profile, refreshProfile, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logSystemAction('USER_LOGOUT', 'User initiated logout');
      await signOut();
      navigate('/login');
    } catch (err) {
      secureLogger.error('Logout error', { errorType: (err as Error)?.name });
      navigate('/login');
    }
  };

  const handleLogoUploadSuccess = async () => {
    try {
      await refreshProfile();
    } catch (err) {
      secureLogger.error('Profile refresh after logo upload failed', { errorType: (err as Error)?.name });
    }
  };

  // Check if logo is missing. 
  // We strictly check profile loaded && !loading to avoid flashing the modal during initial fetch.
  const showLogoUpload = !loading && profile && !profile.logo_url;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-dark-950 text-neutral-200 font-sans selection:bg-neutral-600 selection:text-white relative flex flex-col">
        <Navbar 
          onOpenSettings={() => setIsSettingsOpen(true)} 
          onLogout={handleLogout} 
        />

        <main className={`flex-1 max-w-[1400px] w-full mx-auto px-4 md:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${showLogoUpload ? 'blur-sm pointer-events-none' : ''}`}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<CompetitorTable />} />
              <Route path="categories" element={<CategoryList />} />
              <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>

        <footer className="w-full text-center text-[10px] text-neutral-700 font-medium py-4 uppercase tracking-widest mt-auto">
          @ NCCUStudios. All rights Reserved.
        </footer>

        {isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )}

        {/* Mandatory Blocking Modal */}
        {showLogoUpload && (
          <div className="pointer-events-auto">
            <LogoUploadModal onUploadSuccess={handleLogoUploadSuccess} />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default UserDashboard;