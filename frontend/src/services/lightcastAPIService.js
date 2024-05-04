import axios from "axios"; 
import cvFormUtils from "../components/CV_form/cvFormUtils";

const API_URL = 'http://localhost:3001/api/get-token';

const fetchToken = async () => {
    try { 
        const response = await axios({
        method: 'POST',
        url: API_URL
        });
        const data = response.data;
        const token = data.access_token;

        return token;

    } catch (error) {

        console.error('Error fetching token:', error);
        return null;

    }
};


const fetchSkills = async (token) => {

    var totalSkills = [];
    const softSkills = cvFormUtils.SOFT_SKILLS, staticSkills = cvFormUtils.STATIC_SKILLS;

    try {
        const response = await axios({
            method: 'GET',
            url: 'https://emsiservices.com/skills/versions/latest/skills', params: {
            q: 'programming',  
            fields: 'id,name,type,infoUrl',
            limit: '150'
            }, 
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }); 
      
        const apiData = response.data.data.map(skill => skill.name);
        console.log(apiData);
      
        totalSkills = [...apiData, ...softSkills]; 

    } catch (error) {

        totalSkills = [... softSkills, ...staticSkills];
        
        console.error('Error fetching skills from ApiSkills:', error);
    }

    console.log('total skilss in service '+ totalSkills)
    return totalSkills;

};


export default {
    fetchToken,
    fetchSkills
}