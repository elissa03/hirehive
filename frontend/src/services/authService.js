import axios from "axios";

const API_URL = "http://localhost:3001/auth/";

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}login`, {
    email,
    password,
  });
  return response;
};

const forgotPass = async (email) => {
  const response = await axios.post(`${API_URL}forgotpass`, {
    email,
  });
  return response;
};

const resetPass = async (token, password, confirm_password) => {
  const response = await axios.post(`${API_URL}resetpass/${token}`, {
    password,
    confirm_password,
  });
  return response;
};

export default {
  login,
  forgotPass,
  resetPass,
};
