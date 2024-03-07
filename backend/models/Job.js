import mongoose from "mongoose";
const Schema = mongoose.Schema;

const JobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    requirements: {
        type: [String],
        required: true
    },

    postedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },

    deadline: {
        type: Date,
        default: null,
    }

}, {timestamps: true});

const JobModel = mongoose.model("Job", JobSchema);

export {JobModel as Job}
