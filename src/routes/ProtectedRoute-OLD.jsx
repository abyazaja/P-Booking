import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/AuthContext';
import LoadingSpinner from '../shared/components/ui/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isActiveUser } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isActiveUser()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute; 