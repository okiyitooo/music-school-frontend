import axios from 'axios'
export const API_BASE_URL = 'http://music-theory1.us-east-2.elasticbeanstalk.com';
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
