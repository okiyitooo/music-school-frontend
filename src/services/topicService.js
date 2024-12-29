import { API_BASE_URL, api as axios } from '../utils/authUtils.js';

const API_URL = `${API_BASE_URL}/topics`;

const createTopic = async (topicData) => {
    return await axios.post(API_URL, topicData);
};

const getAllTopics = async () => {
    return await axios.get(API_URL);
};

const getTopicById = async (topicId) => {
    return await axios.get(`${API_URL}/${topicId}`);
};

const updateTopic = async (topicId, topicData) => {
    return await axios.put(`${API_URL}/${topicId}`, topicData);
};

const deleteTopic = async (topicId) => {
    return await axios.delete(`${API_URL}/${topicId}`);
};

export const topicService = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic
};