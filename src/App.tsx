import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import WorkerDetails from './pages/WorkerDetails';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import Messages from './pages/Messages';
import WorkerDashboard from './pages/WorkerDashboard';
import WorkerServices from './pages/WorkerServices';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/common/Header';
import Loading from './components/common/Loading';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/worker/:id" element={<WorkerDetails />} />
        
        {/* Protected routes for users */}
        <Route path="/user-dashboard" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/booking/:workerId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <BookingPage />
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute allowedRoles={['user']}>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute allowedRoles={['user', 'worker']}>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user', 'worker']}>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Protected routes for workers */}
        <Route path="/worker-dashboard" element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/worker-services" element={
          <ProtectedRoute allowedRoles={['worker']}>
            <WorkerServices />
          </ProtectedRoute>
        } />
        
        {/* Protected routes for admins */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="top-center" />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;