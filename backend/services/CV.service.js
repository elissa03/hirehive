import { CV } from "../models/CV.js";

const createCv = async (data) => {

    try {
        console.log(data);

        const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'address', 'email', 'education'];

        requiredFields.forEach(field => {
            if (!data[field]) { 
                return { status: 400, message: `The ${field} field is required.` };
            }
        });

        if (data.education.length === 0) {
            return { status: 400, message: 'The education field must contain at least one entry.' }; 
        }

        const newCv =  new CV({...data});

        await newCv.save();
        return { status: 201, message: "CV created!" };

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
};

const getCv = async (cvId) => {

    try {  
        
        const cv =  await Workspace.findById(cvId);
        
        if (!cv) {
            return { status: 404, message: 'CV not found' }; 
        }
         
        return { status: 200, cv};

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
};

export { 
    createCv,
    getCv
};
