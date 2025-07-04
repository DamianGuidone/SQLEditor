import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5006',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para asegurar el formato JSON
apiClient.interceptors.request.use(config => {
    if (config.data) {
        config.data = JSON.stringify(config.data);
    }
    return config;
});

export default apiClient;