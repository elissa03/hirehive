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

const getJobDetails = async (jobId, userId) => {
  const response = await axios.get(`${API_URL}details/${jobId}`, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
    params: {
      userId: userId,
    },
  });
  return response;
};

const createJob = async (data) => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  return response;
};

const deleteJob = async (jobId, data) => {
  const response = await axios.delete(`${API_URL}${jobId}`, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
    data: data, // pass the data as part of the config object
  });
  return response;
};

const updateJob = async (id, data) => {
  const response = await axios.put(`${API_URL}${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  return response;
};

const getAllJobs = async (userId) => {
  const response = await axios.get(API_URL, {
    params: { userId }, // Pass userId as a query parameter
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  return response;
};

export default {
  getMyJobs,
  createJob,
  deleteJob,
  updateJob,
  getAllJobs,
  getJobDetails,
};
