import { API_BASE_URL, api as axios } from '../utils/authUtils.js';

const API_URL = `${API_BASE_URL}/exercises`;

const createExercise = async (exerciseData) => {
    return await axios.post(API_URL, exerciseData);
};

const getAllExercises = async () => {
    return await axios.get(API_URL);
};

const getExerciseById = async (exerciseId) => {
    return await axios.get(`${API_URL}/${exerciseId}`);
};

const updateExercise = async (exerciseId, exerciseData) => {
    return await axios.put(`${API_URL}/${exerciseId}`, exerciseData);
};

const deleteExercise = async (exerciseId) => {
    return await axios.delete(`${API_URL}/${exerciseId}`);
};

const getAllExercisesByCourseId = async (courseId) => {
    return await axios.get(`${API_URL}?courseId=${courseId}`)
};

const getAllExercisesByTopicId = async (topicId) => {
    return await axios.get(`${API_URL}?topicId=${topicId}`)
};

export const exerciseService = {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
    getAllExercisesByCourseId
    ,getAllExercisesByTopicId
};