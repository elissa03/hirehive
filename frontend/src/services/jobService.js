import axios from "axios";
import localStorageUtils from "../utils/localStorageUtils.js";

const API_URL = "http://localhost:3001/jobs/myJobs/";

const getMyJobs = async (id) => {
  const response = await axios.get(`${API_URL}${id}`, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  return response;
};


export default {
    getMyJobs
}

