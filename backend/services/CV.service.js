import { CV } from "../models/CV.js";
import { User } from "../models/User.js";

/**
 * 
 * This request expects the following data upon creating a cv:
 * 'userId': to add new CV to user model,
 * 'firstName', 'lastName', 'phoneNumber', 'address', 'email', 'education': CV details
 * 'education': [{}] is an array of objects that expects in each object:
 * {
 * 'school': ... , 'degree': ... , 'fieldOfStudy': ..., 'startDate': ...
 * }
 * @param {*} data: req body 
 * @returns : status and message of creation
 */
const createCv = async (data) => {

    try {
        console.log("data " + JSON.stringify(data));

        if (!data.userId) {
            return { status: 400, message: `The userId is required.` };
        }

        const userId = data.userId;
        delete data.userId;

        const requiredFields = ['firstName', 'lastName', 'phoneNumber', 'address', 'email', 'education'];

        let missingField = null;

        requiredFields.forEach(field => {
            if (!data[field]) {  
                missingField = field;
            }
        });

        if (missingField) {
            
            return { status: 400, message: `The ${missingField} field is required.` };

        }
        
        const requiredEdFields = ['school', 'degree', 'fieldOfStudy', 'startDate']
        data['education'].forEach(element=> {
            requiredEdFields.forEach(field=> {
                if (!element[field]) {  
                    missingField = field;
                }
            })
        })

        if (missingField) {
            return { status: 400, message: `The ${missingField} field is required in education section.` };
        }
 
        const newCv =  new CV({...data});

        await newCv.save();
 
        await User.findByIdAndUpdate(userId, { $push: { cvIds: newCv._id } });

        return { status: 201, message: "CV created!" };

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
};

/**
 * The request expects userId in req.body, and cvId, makes sure the requested CV is existent,
 * the user exists, and whether he/she has permission to open this CV
 * @param {*} cvId : from req.params
 * @param {*} data : req.body
 * @returns 
 */
const getCv = async (cvId, data) => {

    try {  
        
        if (!data.userId) {
            return { status: 400, message: 'The field userId is missing from req body' }; 
        }

        const cv =  await CV.findById(cvId);
        
        if (!cv) {
            return { status: 404, message: 'CV not found!' }; 
        }
         
        const user = await User.findById(data.userId);

        if (!user) {
            return { status: 404, message: 'Requested user does not exist!' }; 
        }

        if (!user.cvIds || !user.cvIds.map(id => id.toString()).includes(cvId)) {
            return { status: 403, message: 'Forbidden: CV does not correspond to user!' }; 
        }   

        console.log('success ' + JSON.stringify(cv));
        
        return { status: 200, cv};

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
};

/**
 * The request expects userId in req.body, and cvId as param, makes sure the requested CV is existent,
 * the user exists, and whether he/she has permission to delete this CV
 * @param {*} cvId : from req.params
 * @param {*} data : req.body
 * @returns 
 */
const deleteCv = async (cvId, data) => {

    try {  
        
        if (!data.userId) {
            return { status: 400, message: 'The field userId is missing from req body' }; 
        }

        const cv =  await CV.findById(cvId);
        
        if (!cv) {
            return { status: 404, message: 'CV not found!' }; 
        }
         
        const user = await User.findById(data.userId);

        if (!user) {
            return { status: 404, message: 'Requested user does not exist!' }; 
        }

        if (!user.cvIds || !user.cvIds.map(id => id.toString()).includes(cvId)) {
            return { status: 403, message: 'Forbidden: CV does not correspond to user!' }; 
        }        
        
        await CV.deleteOne({ _id: cvId });

        await User.updateOne(
            { _id: user._id }, 
            { $pull: { cvIds: cvId } } 
        );
          

        return { status: 200, message: "CV deleted successfully."};

    } catch (error) {

        console.log(error);
        return { status: 500, message: "Internal error" };

    }
};

export { 
    createCv,
    getCv, 
    deleteCv
};
