import { API_BASE_URL, api as axios } from '../utils/authUtils.js';


const API_URL = `${API_BASE_URL}/auth`

const signup = async (signupData) => {
    return await axios.post(`${API_URL}/signup`, signupData);
};


const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response;
};
const logout = async () => {
    return await axios.post(`${API_URL}/logout`);
}

const verifyToken = async (token) => {
    return await axios.post(`${API_URL}/validateToken`, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

const updateAccount = async (updateData) => {
    return await axios.put(`${API_URL}/updateAccount`, updateData);
};

export const authService = {
    signup,
    login,
    logout
    , verifyToken
    , updateAccount
}