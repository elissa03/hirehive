import axios from "axios";
import localStorageUtils from "../utils/localStorageUtils.js";

const API_URL = "http://localhost:3001/user/";

const signup = async (data) => {
  const response = await axios.post(`${API_URL}signup`, data);
  return response;
};

const getUserById = async (userId) => {
  const config = {
    headers: { Authorization: `Bearer ${localStorageUtils.getToken()}` },
  };
  const response = await axios.get(`${API_URL}${userId}`, config);
  return response;
};
export default { signup, getUserById };
