import mongoose from "mongoose";

const CvSchema = new mongoose.Schema({

    title: {
        type: String, 
        default: "Untitled",
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },
    
    phoneNumber: {
        type: String,
        required: true
    },
    
    address: {
        type: String,
        required: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    
    education: [{
        school: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String }
    }],
    
    experience: [{
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String }
    }],
    
    skills: {
        type: [String],
        default: []
    },
    
    languages: [{
        language: { type: String },
        proficiency: { type: String }
    }],
    
    hobbies: [String],
    
    additionalSections: [{
        title: {
            type: String,
            required: true
        },

        type: {
            type: String,
            required: true,
            enum: ['list', 'description'] // only allows the options to be'list' or 'description'
        },

        content: {
            type: Schema.Types.Mixed, // could be a list or a string 
            required: true
        }
    }],

    user: { type: Schema.Types.ObjectId, ref: 'User' },
    jobApps: [{ type: Schema.Types.ObjectId, ref: 'JobApp' }]

}, { timestamps: true });

const CvModel = mongoose.model("CV", CvSchema);

export {CvModel as CV}
