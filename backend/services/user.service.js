import bcrypt from "bcrypt";
import { User } from "../models/User.js";

const createUser = async (data) => {
  try {
    console.log(data);
    const { username, email, password, confirm_password } = data;

    if (!username || !email || !password || !confirm_password) {
      return { status: 400, message: "Please fill out all the fields" };
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { status: 409, message: "The email is already in use" };
      } else if (password !== confirm_password) {
        return { status: 400, message: "Passwords don't match" };
      }
      const hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      const newUser =  new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();
      return { status: 201, message: "User registered" };
    }
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

export { createUser };
