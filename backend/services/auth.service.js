import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const login = async (data) => {
  try {
    const { email, password } = data;

    if (!email || !password) {
      return { status: 400, message: "Please provide an email and password" };
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { status: 401, message: "Email or Password is incorrect" };
    }
    return {
      status: 200,
      message: "Successful",
      user,
    };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

const forgotPass = async (data) => {
  const { email } = data;
  try {
    if (!email) {
      return {
        status: 400,
        message: "Please provide an email",
      };
    }
    const user = await User.findOne({ email });
    if (!user) {
      return { status: 404, message: "User not registered" };
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });
    const resetPasswordUrl = `http://localhost:5173/resetpass/${token}`; // Link to reset password page
    const emailMessage = `
Hello,

You are receiving this email because we received a password reset request for your account.

Please click on the following link, or paste this into your browser to complete the process within the next 5 minutes:

${resetPasswordUrl}

If you did not request a password reset, please ignore this email or reply to inform us. This link will expire in 5 minutes.

Thank you,

HireHive
`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_EMAIL,
        pass: process.env.NODE_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.NODE_EMAIL,
      to: email,
      subject: "Reset Password",
      text: emailMessage,
    };

    await transporter.sendMail(mailOptions);
    return { status: 200, message: "Email sent" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

const resetPass = async (data) => {
  try {
    const { token, password, confirm_password } = data;
    if (!password || !confirm_password) {
      return {
        status: 400,
        message: "Password and confirm password must be provided",
      };
    }
    if (password !== confirm_password) {
      return { status: 400, message: "Passwords don't match" };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;

    const hashedPassword = await bcrypt.hash(password, 8);
    await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
    return { status: 200, message: "Password has been reset successfully" };
  } catch (error) {
    console.log(error);
    return { status: 500, message: "Internal error" };
  }
};

export { login, forgotPass, resetPass };
