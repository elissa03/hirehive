import mongoose from "mongoose";
const Schema = mongoose.Schema;

const JobAppSchema = new mongoose.Schema({

    
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },

    CV: { 
        type: Schema.Types.ObjectId,
        ref: 'CV',
        required: true
    },

    job: { 
        type: Schema.Types.ObjectId, 
        ref: 'Job' 
    },

    coverLetter: {
        type: String,
        required: true,
    },

    isShortListed: {
        type: Boolean, 
        default: false 
    },

    status: {
        type: String,

    },

    submissionDate: {
        type: Date,
        default: null,
    }

}, {timestamps: true});

const JobAppModel = mongoose.model("JobApp", JobAppSchema);

export {JobAppModel as JobApp}
