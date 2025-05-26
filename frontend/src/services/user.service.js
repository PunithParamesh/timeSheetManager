import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/api/users/"; 

const getAll = async () => {
  return await axios.get(API_URL, { headers: authHeader() });
};

const userService = {
  getAll,
};

export default userService;
