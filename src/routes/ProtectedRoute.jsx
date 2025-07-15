import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, authReady } = useAuth();

  // App.jsx already handles auth loading, so we only check if auth is ready
  if (!authReady) {
    return null; // Let App.jsx handle the loading display
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render protected content
  return children;
};

export default ProtectedRoute;