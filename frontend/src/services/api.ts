import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5006',
});

export default apiClient;