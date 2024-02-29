import axios from "axios";

const API_URL = "http://localhost:3001/user/";

const signup = async (data) => {
  const response = await axios.post(`${API_URL}signup`, data);
  return response;
};

export default { signup };
