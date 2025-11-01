import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';

const Dashboard: React.FC = () => {
  const { userData, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!userData) {
    return <Navigate to="/login" />;
  }

  // Redirect based on user role
  switch (userData.role) {
    case 'user':
      return <Navigate to="/user-dashboard" />;
    case 'worker':
      return <Navigate to="/worker-dashboard" />;
    case 'admin':
      return <Navigate to="/admin" />;
    default:
      return <Navigate to="/" />;
  }
};

export default Dashboard;


