import { API_BASE_URL, api as axios } from '../utils/authUtils.js';

const API_URL = `${API_BASE_URL}/messages`;

const createMessage = async (messageData) => {
    return await axios.post(API_URL, messageData);
};

const getAllMessages = async () => {
    return await axios.get(API_URL);
};

const getMessageById = async (messageId) => {
    return await axios.get(`${API_URL}/${messageId}`);
};

const getMessagesBySenderId = async (senderId) => {
    return await axios.get(`${API_URL}/sender/${senderId}`);
};

const getMessagesByReceiverId = async (receiverId) => {
    return await axios.get(`${API_URL}/recipient/${receiverId}`);
};

const redactMessage = async (messageId, messageData) => {
    return await axios.put(`${API_URL}/redact/${messageId}`, messageData);
};

const deleteMessageForUser = async (messageId, userId) => {
    return await axios.delete(`${API_URL}/${messageId}/${userId}`);
};

export const messageService = {
    createMessage,
    getAllMessages,
    getMessageById,
    getMessagesBySenderId,
    getMessagesByReceiverId,
    redactMessage,
    deleteMessageForUser
};