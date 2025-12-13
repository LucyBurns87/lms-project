import axios from 'axios';
import config from '../config';

const apiClient = axios.create({
    baseURL: config.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;