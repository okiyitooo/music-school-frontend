import { API_BASE_URL, api as axios } from '../utils/authUtils.js';

const API_URL = `${API_BASE_URL}/courses`;

const createCourse = async (courseData) => {
    return await axios.post(API_URL, courseData);
};

const getAllCourses = async () => {
    return await axios.get(API_URL);
};

const getCourseById = async (courseId) => {
    return await axios.get(`${API_URL}/${courseId}`);
};

const updateCourse = async (courseId, courseData) => {
    return await axios.put(`${API_URL}/${courseId}`, courseData);
};

const deleteCourse = async (courseId) => {
    return await axios.delete(`${API_URL}/${courseId}`);
};

export const courseService = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};