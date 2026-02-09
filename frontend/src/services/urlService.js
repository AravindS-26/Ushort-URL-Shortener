import api from './api';

/**
 * Service for interacting with URL-related endpoints.
 * Handles shortening requests and analytics retrieval.
 */
const urlService = {
    /**
     * Sends a long URL to the backend for shortening.
     * @param {string} originalUrl - The source URL to shorten
     * @returns {Promise<Object>} The shortening response metadata
     */
    shortenUrl: async (originalUrl) => {
        const response = await api.post('/shorten', { originalUrl });
        return response.data;
    },

    /**
     * Fetches analytics data for a specific short code.
     * @param {string} shortCode - The unique identifier to look up
     * @returns {Promise<Object>} Full analytics payload
     */
    getAnalytics: async (shortCode) => {
        const response = await api.get(`/analytics/${shortCode}`);
        return response.data;
    }
};

export default urlService;
