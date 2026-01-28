import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex-center" style={{ height: '100vh' }}>Loading security modules...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node
};

export default ProtectedRoute;
