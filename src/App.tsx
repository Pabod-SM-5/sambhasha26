import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import UpdatePasswordScreen from './components/UpdatePasswordScreen';
import UserDashboard from './components/user_Dashboard/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-950 text-white selection:bg-neutral-600 selection:text-white font-sans overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="/update-password" element={<UpdatePasswordScreen />} />
          
          {/* User Routes - Protected (Nested) */}
          <Route path="/user/*" element={
            <ProtectedRoute allowedRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes - Protected (Nested) */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;