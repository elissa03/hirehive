import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String },
  jobApps: [{ type: Schema.Types.ObjectId, ref: "JobApp" }],
  cvIds: [{ type: Schema.Types.ObjectId, ref: "CV", default: [] }],
  jobs: [{ type: Schema.Types.ObjectId, ref: "Job", default: [] }],
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
