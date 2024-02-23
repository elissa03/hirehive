import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  JobApplications: [{ type: Schema.Types.ObjectId, ref: 'JobApp'}],
  CVs: [{ type: Schema.Types.ObjectId, ref: 'CV'}]
});

const UserModel = mongoose.model("User", UserSchema);

export {UserModel as User}
