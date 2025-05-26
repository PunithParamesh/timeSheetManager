import axios from "axios";

const API_URL = "http://localhost:5000/api";

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  const data = JSON.parse(localStorage.getItem("user"));
  return data ? data.user : null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
