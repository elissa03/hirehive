import axios from "axios"; 
import dotenv from "dotenv";
dotenv.config();

/**
 * This controller allows us to connect to the external API, to retrieve the skills needed. 
 * In this request, a token is granted, which lasts for 3600 sec, and allows us to retrieve
 * the skills in the frontend. 
 * 
 * v2.14.0
 * https://docs.lightcast.dev/apis/skills 
 * 
 * @param {*} req 
 * @param {*} res 
 */
const lightcastAPIController = async (req, res) => {
    const options = {
      method: 'post',
      url: 'https://auth.emsicloud.com/connect/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        client_id: process.env.CLIENT_ID,   
        client_secret: process.env.CLIENT_SECRET,   
        grant_type: 'client_credentials',
        scope: 'emsi_open'
      })
    };
  
    try {
      const response = await axios(options); 
      res.send(response.data);  
    } catch (error) {

      console.error('Failed to fetch token:', error);
      res.status(500).send('Failed to fetch token');

    }
}

export {

    lightcastAPIController

}