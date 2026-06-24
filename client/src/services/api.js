import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
   // baseURL: 'http://localhost:5000/api'//
});

// Every request  token will be auto add 
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Notes APIs
export const getNotes = () => API.get('/notes');
export const createNote = (data) => API.post('/notes', data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const pinNote = (id) => API.put(`/notes/${id}/pin`);
export const getArchivedNotes = () => API.get('/notes/archive');
export const restoreNote = (id) =>
  API.put(`/notes/${id}/restore`);
export const permanentlyDeleteNote = (id) =>
  API.delete(`/notes/${id}/permanent`);
export const favoriteNote = (id) => API.put(`/notes/${id}/favorite`);