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
  console.log("API response:", response);
  return response; // Return the API response data
};

export default { getJobApps, shortlistApplicant };
