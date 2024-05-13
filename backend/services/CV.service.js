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

    if (!data.userId) {
      return { status: 400, message: `The userId is required.` };
    }

    const userId = data.userId;
    delete data.userId;

    const requiredFields = [
      "firstName",
      "lastName",
      "email" 
    ];

    let missingField = null;

    requiredFields.forEach((field) => {
      if (!data[field]) {
        missingField = field;
      }
    });

    if (missingField) {
      return { status: 400, message: `The ${missingField} field is required.` };
    }

    // filter out empty skills "" 
    if (data.skills) {

      const filteredSkills = data.skills.filter(skill => 
        skill.trim().length > 0).map(skill => skill.trim().charAt(0).toUpperCase() + skill.trim().slice(1));

      if (filteredSkills.length > 0) {
        data.skills = filteredSkills;
      } else {
        delete data.skills;
      }

      if (filteredSkills.length > 0) {
        data.skills = filteredSkills;
      } else {
        delete data.skills;
      }
    }
    
    if ('education' in data && data.education) {
      
      const educationRequiredEdFields = ["school", "degree", "fieldOfStudy", "startDate", "location"];

      // validate every education in the array
      data["education"].forEach((element) => {
        
        // make sure it includes the required fields
        educationRequiredEdFields.forEach((field) => {
          if (!element[field] || element[field].trim().length === 0) {
            missingField = field;
          }
        });

        // in case the endDate is included in the education make sure it's empty
        if ('endDate' in element && element.endDate.trim().length === 0) {
          delete element.endDate;
        }

      }); 
    }   

    if ('experience' in data && data.experience) {
      data['experience'].forEach((element) => {
        if ('endDate' in element && element.endDate.trim().length === 0) {
          delete element.endDate;
        }
      })
    }

    if (missingField) {
      return {
        status: 400,
        message: `The ${missingField} field is required in education section.`,
      };
    }

    data["user"] = userId;

    const newCv = new CV({ ...data });
    await newCv.save();
 
    await User.findByIdAndUpdate(userId, { $push: { cvIds: newCv._id } });

    return { status: 201, message: "Successful!", cvId: newCv._id.toString() };

  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }

};

/**
 * The request expects userId in req.body, and cvId, makes sure the requested CV is existent,
 * the user exists, and whether he/she has permission to open this CV
 * @param {*} cvId : from req.params
 * @param {*} userId : req.query 
 * @returns
 */
const getCv = async (cvId, userId) => {
  try {
    if (!userId) {
      return {
        status: 400,
        message: "The field userId is missing from req query params",
      };
    }
 
    const user = await User.findById(userId);

    if (!user) {
      return { status: 404, message: "Requested user does not exist!" };
    }

    const cv = await CV.findById(cvId);

    if (!cv) {
      return { status: 404, message: "CV not found!" };
    }

    return { status: 200, cv };
    
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

    console.log("reached back " + JSON.stringify(data));
    if (!data.userId) {
      return {
        status: 400,
        message: "The field userId is missing from req body",
      };
    }

    const cv = await CV.findById(cvId);

    if (!cv) {
      return { status: 404, message: "CV not found!" };
    }

    const userId = data.userId;
    const user = await User.findById(userId);

    if (!user) {
      return { status: 404, message: "Requested user does not exist!" };
    }

    if (userId !== cv.user.toString()) {
      return {
        status: 403,
        message: "Forbidden: CV does not correspond to user!",
      };
    }

    // await CV.deleteOne({ _id: cvId });

    await User.updateOne({ _id: user._id }, { $pull: { cvIds: cvId } });

    return { status: 200, message: "CV deleted successfully." };

  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

/**
 * The request expects userId as param, makes sure the user is existent,
 * and gets the cvs created by the person
 *
 * @param {*} userId : from req.params
 * @returns {cvId: cvData, ...}
 */
const getAllCvs = async (userId) => {
  
  try { 
    const user = await User.findById(userId);

    if (!user) {
      return { status: 404, message: "Requested user does not exist!" };
    }

    const cvIds = user.cvIds;
    let cvObjs = {};

    const cvPromises = cvIds.map((cvId) => CV.findById(cvId));

    const cvs = await Promise.all(cvPromises);
    
    cvs.forEach((cv) => {
      if (cv)
        cvObjs[cv._id.toString()] = cv;
    });

    return { status: 200, cvs: cvObjs };

  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

/**
 * The request expects userId in req.body, and cvId as param, and newData as obj in req.body,
 * makes sure the requested CV is existent, the user exists, and whether he/she has permission
 * to update this CV.
 * @param {*} cvId : from req.params
 * @param {*} data : req.body: {userID: ..., newData: {}}
 * @returns
 */
const updateCv = async (cvId, data) => {
  try {
    if (!data.userId) {
      return {
        status: 400,
        message: "The field userId is missing from req body",
      };
    }

    const cv = await CV.findById(cvId);

    if (!cv) {
      return { status: 404, message: "CV not found!" };
    }

    const user = await User.findById(data.userId);

    if (!user) {
      return { status: 404, message: "Requested user does not exist!" };
    }
 
    if (data.userId !== cv.user.toString()) {
      return {
        status: 403,
        message: "Forbidden: CV does not correspond to user!",
      };
    }

    if (
      !data["newData"] ||
      typeof data["newData"] !== "object" ||
      Object.keys(data["newData"]).length === 0
    ) {
      return {
        status: 400,
        message: "The new data is missing from req body or wrong format!",
      };
    }

    const newData = data.newData;

    let missingField = null;

    if (newData["education"]) {
      const requiredEdFields = [
        "school",
        "degree",
        "fieldOfStudy",
        "startDate",
      ];
      newData["education"].forEach((element) => {
        requiredEdFields.forEach((field) => {
          if (!element[field]) {
            missingField = field;
          }
        });
      });
    }

    if (missingField) {
      return {
        status: 400,
        message: `The ${missingField} field is required in education section.`,
      };
    }

    await CV.updateOne(
      { _id: cvId },
      {
        $set: {
          ...newData,
        },
      }
    );

    return { status: 200, message: "CV updated successfully." };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

export { createCv, getCv, deleteCv, getAllCvs, updateCv };
