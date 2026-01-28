import api from './api';

export const labService = {
    getAllLabs: async () => {
        const response = await api.get('/labs');
        return response.data;
    },

    getLabById: async (id) => {
        const response = await api.get(`/labs/${id}`);
        return response.data;
    },

    startLab: async (labId) => {
        const response = await api.post('/sessions/start', { labId });
        return response.data;
    },

    createLab: async (labData) => {
        const response = await api.post('/labs', labData);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/labs/categories');
        return response.data;
    },

    verifyFlag: async (labId, flag) => {
        const response = await api.post(`/labs/${labId}/verify`, { flag });
        return response.data;
    },

    stopLab: async (sessionId) => {
        const response = await api.post(`/sessions/${sessionId}/stop`);
        return response.data;
    },

    pauseLab: async (sessionId) => {
        const response = await api.post(`/sessions/${sessionId}/pause`);
        return response.data;
    },

    resumeLab: async (sessionId) => {
        const response = await api.post(`/sessions/${sessionId}/resume`);
        return response.data;
    },

    getLogs: async (sessionId) => {
        const response = await api.get(`/sessions/${sessionId}/logs`);
        return response.data;
    },

    emergencyStopAll: async () => {
        const response = await api.post('/sessions/emergency-stop');
        return response.data;
    }
};

