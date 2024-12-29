import { API_BASE_URL, api as axios } from '../utils/authUtils.js';

const API_URL = `${API_BASE_URL}/users`;

const getAllUsers = async () => {
    return await axios.get(API_URL);
};

const getUserById = async (userId) => {
    return await axios.get(`${API_URL}/${userId}`);
};

const updateUser = async (userId, userData) => {
    return await axios.put(`${API_URL}/${userId}`, userData);
};

const deleteUser = async (userId) => {
    return await axios.delete(`${API_URL}/${userId}`);
};

const lockUser = async (username) => {
    return await axios.post(`${API_URL}/lock/${username}`);
};

const unlockUser = async (username) => {
    return await axios.post(`${API_URL}/unlock/${username}`);
};

const setAccountExpiration = async (username, milliseconds) => {
    return await axios.post(`${API_URL}/expire/${username}/${milliseconds}`);
};

const updateUserRole = async (userId, newRole) => {
    return await axios.put(`${API_URL}/role/${userId}/${newRole}`);
};

const getAllInstructors = async () => {
    return await axios.get(`${API_URL}?role=INSTRUCTOR`)
}

export const userService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    lockUser,
    unlockUser,
    setAccountExpiration,
    updateUserRole,
    getAllInstructors
};