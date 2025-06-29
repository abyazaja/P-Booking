import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

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