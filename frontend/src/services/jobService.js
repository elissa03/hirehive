import axios from "axios";
import localStorageUtils from "../utils/localStorageUtils.js";

const API_URL = "http://localhost:3001/jobs/";

const getMyJobs = async (id) => {
  const response = await axios.get(`${API_URL}myJobs/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  return response;
};

const deleteJob = async (id) => {
  const response = await axios.delete(`${API_URL}${id}`, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  return response;
};

const updateJob = async (id, data) => {
  const response = await axios.put(`${API_URL}${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  console.log("here",response)
  return response;
};

export default {
  getMyJobs,
  deleteJob,
  updateJob,
};
