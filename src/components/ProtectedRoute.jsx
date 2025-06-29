import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    
    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    return children;
};