import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const loginUser = (student_id, password) =>
  API.post('/api/auth/login', { student_id, password });
export const registerUser = (data) =>
  API.post('/api/auth/register', data);
export const getProfile = () =>
  API.get('/api/auth/me');
export const registerFace = (formData) =>
  API.post('/api/register/face', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000
  });
export const getTodayAttendance = () =>
  API.get('/api/attendance/today');
export const getStudentAttendance = (studentId) =>
  API.get(`/api/attendance/student/${studentId}`);
export const markAttendance = (formData) =>
  API.post('/api/attendance/mark', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000
  });
export const manualMarkAttendance = (data) =>
  API.post('/api/attendance/manual-mark', data);
export const getStudentSummary = (studentId) =>
  API.get(`/api/reports/summary/${studentId}`);
export const downloadPDFReport = (studentId) =>
  API.get(`/api/reports/pdf/${studentId}`, { responseType: 'blob' });
export const downloadExcelReport = (studentId) =>
  API.get(`/api/reports/excel/${studentId}`, { responseType: 'blob' });
export const getUsers = (role = 'student') =>
  API.get(`/api/auth/users?role=${role}`);
export const getAllUsers = () =>
  API.get('/api/auth/users');
export const sendWhatsappAlerts = () =>
  API.post('/api/whatsapp/send-absence-alerts');
export const sendMonthlyReport = (studentId) =>
  API.post(`/api/whatsapp/send-monthly-report/${studentId}`);
export const getRegisteredStudents = () =>
  API.get('/api/register/students');
export const getStudentsFromDB = () =>
  API.get('/api/register/students/db');
export const getStudentsFromMongoDB = () =>
  API.get('/api/register/students/mongodb');
export const checkHealth = () =>
  API.get('/gateway-status');