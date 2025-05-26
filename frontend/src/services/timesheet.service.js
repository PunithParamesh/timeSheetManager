import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api";

const getAll = (startDate, endDate) => {
  return axios.get(`${API_URL}/timesheets`, {
    headers: authHeader(),
    params: { startDate, endDate },
  });
};

const getById = (id) => {
  return axios.get(`${API_URL}/timesheets/${id}`, { headers: authHeader() });
};

const create = (timesheetData) => {
  return axios.post(`${API_URL}/timesheets`, timesheetData, {
    headers: authHeader(),
  });
};

const update = (id, timesheetData) => {
  return axios.put(`${API_URL}/timesheets/${id}`, timesheetData, {
    headers: authHeader(),
  });
};

const remove = (id) => {
  return axios.delete(`${API_URL}/timesheets/${id}`, { headers: authHeader() });
};

const getUserTimesheets = (userId, startDate, endDate) => {
  return axios.get(`${API_URL}/timesheets/user/${userId}`, {
    headers: authHeader(),
    params: { startDate, endDate },
  });
};

const submitForApproval = (id) => {
  return axios.patch(
    `${API_URL}/timesheets/${id}/submit`,
    {},
    { headers: authHeader() }
  );
};

const approveTimesheet = (id) => {
  return axios.put(
    `${API_URL}/timesheets/${id}/approve`,
    {},
    { headers: authHeader() }
  );
};

const rejectTimesheet = (id, reason) => {
  return axios.put(
    `${API_URL}/timesheets/${id}/reject`,
    { reason },
    { headers: authHeader() }
  );
};

const timesheetService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getUserTimesheets,
  submitForApproval,
  approveTimesheet,
  rejectTimesheet,
};

export default timesheetService;
