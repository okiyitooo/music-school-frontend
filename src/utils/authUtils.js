import axios from 'axios'
export const API_BASE_URL = 'http://localhost:8082';
export const api = axios.create({
    baseURL: API_BASE_URL,
});
api.interceptors.request.use((config) => {
    const {token} = JSON.parse(localStorage.getItem('auth'))
    if (token && !config.url.startsWith('/auth')) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Request Error', error)
    return Promise.reject(error);
});
