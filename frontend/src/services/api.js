import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;
            let message = error.response.data?.error || 'An unexpected error occurred';

            switch (status) {
                case 404:
                    message = 'The requested resource was not found.';
                    break;
                case 410:
                    message = 'This link has expired and is no longer available.';
                    break;
                case 429:
                    message = 'Too many requests. Please slow down and try again later.';
                    break;
                case 500:
                    message = 'Server error. Our engineers are on it!';
                    break;
            }
            
            error.userMessage = message;
        } else {
            error.userMessage = 'Network error. Please check your connection.';
        }

        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;
