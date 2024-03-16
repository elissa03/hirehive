import { User } from "../models/User.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  "552189366871-65676mpr7eue0adi8aj5j236v8k0ve6p.apps.googleusercontent.com"
);

const googleSignUp = async (data) => {
  try {
    const { token } = data;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "552189366871-65676mpr7eue0adi8aj5j236v8k0ve6p.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();

    console.log("payload", payload);

    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
      return { status: 409, message: "The email is already in use" };
    }

    //create new user

    return { status: 201, message: "User registered" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

export { googleSignUp };
