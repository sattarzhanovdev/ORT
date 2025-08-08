import axios from "axios";

export const API = {
  getLessons: () => axios.get('/lessons/'),
  getLesson: (id) => axios.get(`/lessons/${id}/`),
  getSubjects: () => axios.get('/subjects/'), 
  getUsers: () => axios.get('/users/'), 
  login: (data) => axios.post('/login/', data)
}