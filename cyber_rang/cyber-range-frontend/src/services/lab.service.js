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
    }
};
