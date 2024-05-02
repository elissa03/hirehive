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

      const newUser = new User({
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

/**
 * Fetches a user by their ID from the MongoDB database.
 * @param {string} id - The MongoDB ObjectId of the user to retrieve.
 * @returns {Promise<Object>} The user object if found, otherwise an error object.
 */
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return { status: 404, message: "User not found" };
    }
    return { status: 200, data: user };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

export { createUser, getUserById };
