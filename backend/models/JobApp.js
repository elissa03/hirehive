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

    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },

    cvId: { 
        type: Schema.Types.ObjectId,
        ref: 'CV',
        required: true
    },

    jobId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Job' 
    },

    coverLetter: {
        type: String,
        default: null,
    },

    isShortListed: {
        type: Boolean, 
        default: false 
    },

    // Unchecked or Under Review
    status: {
        type: String,
        default: "Unchecked"

    },

    submissionDate: {
        type: Date,
        default: null,
    }

}, {timestamps: true});

const JobAppModel = mongoose.model("JobApp", JobAppSchema);

export {JobAppModel as JobApp}
