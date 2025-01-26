import axios from 'axios'
export const API_BASE_URL = 'https://d1uid492sajbp2.cloudfront.net';
export const api = axios.create({
    baseURL: API_BASE_URL,
});
api.interceptors.request.use((config) => {
    const auth = localStorage.getItem('auth');
    if (auth){
        const {token} = JSON.parse(auth)
        if (token && !config.url.startsWith('/auth')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    console.error('Request Error', error)
    return Promise.reject(error);
});
