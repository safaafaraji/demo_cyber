import api from './api';

export const sessionService = {
    startSession: async (labId) => {
        const response = await api.post('/sessions/start', { labId });
        return response.data;
    },

    stopSession: async (sessionId) => {
        const response = await api.post(`/sessions/${sessionId}/stop`);
        return response.data;
    },

    getActiveSession: async () => {
        const response = await api.get('/sessions/active');
        return response.data;
    }
};
