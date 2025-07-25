import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/AuthContext';
import LoadingSpinner from '../shared/components/ui/LoadingSpinner';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin, isActiveUser } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    // If user is not admin, redirect based on their role
    if (isActiveUser()) {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return children;
};

export default AdminRoute; 