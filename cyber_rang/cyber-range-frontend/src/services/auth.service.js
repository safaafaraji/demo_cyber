import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    googleLogin: async (idToken) => {
        const response = await api.post('/auth/google', { idToken });
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (username, email, password) => {
        return await api.post('/auth/register', { username, email, password });
    },

    verifyEmail: async (email, code) => {
        return await api.post('/auth/verify-email', { email, code });
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },
};
