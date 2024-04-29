import axios from "axios";
import localStorageUtils from "../utils/localStorageUtils.js";

const API_URL = "http://localhost:3001/cvs/";

const getAllCvs = async (userId) => { 
    console.log('getting')
    const response = await axios.get(`${API_URL}getAll/${userId}`, {
    headers: {
        Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
    });
    return response;
};

const getCv = async (cvId) => {
     
    const response = await axios.get(`${API_URL}${cvId}`, {
    headers: {
        Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
    });
    return response;

};


const createCv = async (data) => {
  const response = await axios.post(`${API_URL}`, data, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  console.log("here", response);
  return response;
};

const deleteCv = async (cvId, userId) => {
     
    const response = await axios.delete(`${API_URL}${cvId}`, {
    headers: {
        Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
    data: {userId}, // pass the data as part of the config object
    });

    return response;
    
};

/**
 * 
 * @param {*} cvId: id of the cv to be updated
 * @param {*} data: contains userId and newData mapped obj
 * @returns 
 */
const updateCv = async (cvId, data) => {
  console.log('updating')
  const response = await axios.put(`${API_URL}${cvId}`, data, {
    headers: {
      Authorization: `Bearer ${localStorageUtils.getToken()}`,
    },
  });
  console.log("here", response);
  return response;
};

export default {
    getAllCvs, 
    getCv,
    createCv,
    deleteCv,
    updateCv
};
