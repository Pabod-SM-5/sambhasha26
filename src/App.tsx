/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import AuthLayout from './components/AuthLayout';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminLoginPage from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminContestants from './pages/AdminContestants';
import AdminCategories from './pages/AdminCategories';
import AdminOther from './pages/AdminOther';
import AdminLogs from './pages/AdminLogs';
import AdminSchoolProfile from './pages/AdminSchoolProfile';
import Dashboard from './pages/Dashboard';
import UnderMaintenance from './pages/UnderMaintenance';
import Categories from './pages/Categories';
import Submissions from './pages/Submissions';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import LoadingScreen from './components/LoadingScreen';

const targetPaths = ['/', '/login', '/register', '/admin', '/dashboard', '/admin/dashboard'];

function getSection(path: string) {
  if (['/login', '/register', '/forgot-password'].includes(path)) return 'auth';
  if (path === '/admin') return 'admin-auth';
  if (path === '/') return 'maintenance';
  if (path.startsWith('/admin/')) return 'admin-dashboard';
  if (['/dashboard', '/categories', '/rules', '/submissions', '/settings'].includes(path)) return 'user-dashboard';
  return 'unknown';
}

function GlobalLoader({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(() => targetPaths.includes(location.pathname));
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      const prevSection = getSection(prevPath);
      const currSection = getSection(location.pathname);
      
      // Only trigger loader if moving to a DIFFERENT section AND the target is a major path
      if (prevSection !== currSection && targetPaths.includes(location.pathname)) {
        setIsLoading(true);
      } else if (!targetPaths.includes(location.pathname)) {
        // Ensure loader is off for non-target paths
        setIsLoading(false);
      }
      
      setPrevPath(location.pathname);
    }
  }, [location.pathname, prevPath]);

  // Memoize to prevent LoadingScreen's internal timer from resetting on re-renders
  const handleComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleComplete} />}
      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <GlobalLoader>
        <Routes>
          {/* Auth Routes */}
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/contestants" element={<AdminContestants />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/logs" element={<AdminLogs />} />
          <Route path="/admin/school/:id" element={<AdminSchoolProfile />} />
          <Route path="/admin/other" element={<AdminOther />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Default Redirect */}
          <Route path="/" element={<UnderMaintenance />} />
        </Routes>
      </GlobalLoader>
    </BrowserRouter>
  );
}
