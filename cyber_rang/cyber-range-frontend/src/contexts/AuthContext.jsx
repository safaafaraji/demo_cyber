import { useState, createContext, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        setUser(data.user);
        return data;
    };

    const googleLogin = async (idToken) => {
        const data = await authService.googleLogin(idToken);
        setUser(data.user);
        return data;
    };

    const register = async (username, email, password) => {
        const data = await authService.register(username, email, password);
        return data;
    };

    const verifyEmail = async (email, code) => {
        const data = await authService.verifyEmail(email, code);
        setUser(prev => ({ ...prev, isVerified: true }));
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, verifyEmail, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
