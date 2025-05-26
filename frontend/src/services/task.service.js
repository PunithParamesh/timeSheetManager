import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api";

const getAll = () => {
  return axios.get(`${API_URL}/tasks`, { headers: authHeader() });
};

const getById = (id) => {
  return axios.get(`${API_URL}/tasks/${id}`, { headers: authHeader() });
};

const create = (taskData) => {
  return axios.post(`${API_URL}/tasks`, taskData, { headers: authHeader() });
};

const update = (id, taskData) => {
  return axios.put(`${API_URL}/tasks/${id}`, taskData, {
    headers: authHeader(),
  });
};

const remove = (id) => {
  return axios.delete(`${API_URL}/tasks/${id}`, { headers: authHeader() });
};

const taskService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default taskService;
