import api from './api';

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    getUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    getActiveSessions: async () => {
        const response = await api.get('/admin/sessions');
        return response.data;
    },

    emergencyStopAll: async () => {
        const response = await api.post('/admin/sessions/stop-all');
        return response.data;
    }
};
