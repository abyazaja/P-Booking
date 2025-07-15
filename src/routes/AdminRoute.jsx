import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, authReady } = useAuth();

  // App.jsx already handles auth loading, so we only check if auth is ready
  if (!authReady) {
    return null; // Let App.jsx handle the loading display
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not admin, redirect to user dashboard
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // User is admin, render admin content
  return children;
};

export default AdminRoute;