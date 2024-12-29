import { API_BASE_URL, api as axios } from '../utils/authUtils.js';

const API_URL = `${API_BASE_URL}/enrollments`;

const getAllEnrollments = async () => {
    return await axios.get(API_URL);
};

const getEnrollmentsByCourseId = async (courseId) => {
    return await axios.get(`${API_URL}/course/${courseId}`);
};

const enrollInCourse = async (enrollmentData) => {
    return await axios.post(API_URL, enrollmentData);
};

const getEnrollmentsByStudentId = async (studentId) => {
    return await axios.get(`${API_URL}/student/${studentId}`);
};

const getEnrollmentById = async (enrollmentId) => {
    return await axios.get(`${API_URL}/${enrollmentId}`);
};

const updateEnrollment = async (enrollmentId, enrollmentData) => {
    return await axios.put(`${API_URL}/${enrollmentId}`, enrollmentData);
};

const deleteEnrollment = async (enrollmentId) => {
    return await axios.delete(`${API_URL}/${enrollmentId}`);
};

const updateProgress = async (enrollmentId, topicId, completed, score) => {
    return await axios.post(`${API_URL}/progress/${enrollmentId}/${topicId}/${completed}/${score}`);
};

export const enrollmentService = {
    enrollInCourse,
    getAllEnrollments,
    getEnrollmentsByCourseId,
    getEnrollmentsByStudentId,
    getEnrollmentById,
    updateEnrollment,
    deleteEnrollment,
    updateProgress
};