import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (currentPassword, newPassword) => api.put('/auth/change-password', { currentPassword, newPassword })
};

export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id) => api.put(`/users/${id}/reset-password`),
  getRoles: () => api.get('/users/roles')
};

export const studentService = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  import: (students) => api.post('/students/import', { students }),
  export: (params) => api.get('/students/export', { params })
};

export const teacherService = {
  getAll: () => api.get('/teachers'),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (data) => api.post('/teachers', data),
  update: (id, data) => api.put(`/teachers/${id}`, data),
  delete: (id) => api.delete(`/teachers/${id}`)
};

export const classService = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`)
};

export const subjectService = {
  getAll: () => api.get('/subjects'),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`)
};

export const journalService = {
  getAll: (params) => api.get('/journals', { params }),
  getById: (id) => api.get(`/journals/${id}`),
  create: (data) => api.post('/journals', data),
  update: (id, data) => api.put(`/journals/${id}`, data),
  delete: (id) => api.delete(`/journals/${id}`),
  getRecap: (params) => api.get('/journals/recap', { params })
};

export const bkService = {
  getCases: (params) => api.get('/bk/cases', { params }),
  getCaseById: (id) => api.get(`/bk/cases/${id}`),
  createCase: (data) => api.post('/bk/cases', data),
  updateCase: (id, data) => api.put(`/bk/cases/${id}`, data),
  addNote: (data) => api.post('/bk/notes', data),
  getStudentRecap: (studentId) => api.get(`/bk/student-recap/${studentId}`),
  getViolations: (params) => api.get('/bk/violations', { params }),
  createViolation: (data) => api.post('/bk/violations', data),
  getAchievements: (params) => api.get('/bk/achievements', { params }),
  createAchievement: (data) => api.post('/bk/achievements', data)
};

export const attendanceService = {
  getAll: (params) => api.get('/attendance', { params }),
  create: (data) => api.post('/attendance', data),
  bulkCreate: (records) => api.post('/attendance/bulk', { attendance_records: records }),
  getStudentReport: (studentId, params) => api.get(`/attendance/report/student/${studentId}`, { params })
};

export const gradeService = {
  getAll: (params) => api.get('/grades', { params }),
  create: (data) => api.post('/grades', data),
  update: (id, data) => api.put(`/grades/${id}`, data),
  getStudentGrades: (studentId, params) => api.get(`/grades/student/${studentId}`, { params })
};

export const scheduleService = {
  getAll: (params) => api.get('/schedules', { params }),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`)
};

export const reportService = {
  getDashboard: () => api.get('/reports/dashboard'),
  getAcademic: (params) => api.get('/reports/academic', { params }),
  getStudentProfile: () => api.get('/reports/student-profile'),
  getChildProfile: () => api.get('/reports/child-profile')
};

export const logService = {
  getAll: (params) => api.get('/logs', { params }),
  getByUser: (userId) => api.get(`/logs/user/${userId}`)
};

export default api;
