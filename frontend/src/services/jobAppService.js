import axios from "axios";
import localStorageUtils from "../utils/localStorageUtils.js";

const API_URL = "http://localhost:3001/jobApps/";

const getJobApps = async (jobId, userId) => {
  const response = await axios.get(`${API_URL}getAllApplicants/${jobId}`, {
    params: { userId }, // Pass userId as a query parameter
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  return response;
};

const shortlistApplicant = async (jobAppId, userId, shortlisted) => {
  const response = await axios.put(
    `${API_URL}${jobAppId}`,
    { userId, shortlisted }, 
    {
      headers: {
        Authorization: `Bearer ${localStorageUtils.getToken()}`,
      },
    }
  );
  return response; 
};

const createApplication = async (jobId, data) => {
  const response = await axios.post(`${API_URL}apply/${jobId}`, data, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`
    },
  });
  return response

}

const getJobAppDetails = async (jobAppId, userId) => {
  const response = await axios.get(`${API_URL}${jobAppId}`, {
    params: { userId },
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  return response;
}

export default { getJobApps, shortlistApplicant, createApplication, getJobAppDetails };
