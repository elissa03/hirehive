import { login, forgotPass, resetPass } from "../services/auth.service.js";
import jwt from "jsonwebtoken";

const loginController = async (req, res) => {
  try {
    const result = await login({
      email: req.body.email,
      password: req.body.password,
    });
    //console.log("result", result);
    if (result.status === 200) {
      const token = jwt.sign({ id: result.user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { maxAge: 360000 });
      return res
        .status(200)
        .json({ message: result.message, token: token, user: result.user });
    } else {
      return res.status(result.status).json({ message: result.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const forgotPassController = async (req, res) => {
  try {
    const result = await forgotPass({
      email: req.body.email,
    });
    console.log(result);
    if (result.status === 200) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(result.status).json({ message: result.message });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetPassController = async(req, res) => {
    try {
      const result = await resetPass({
        token: req.params.token,
        password: req.body.password,
        confirm_password: req.body.confirm_password
      })
      if (result.status === 200) {
        res.status(200).json({ message: result.message });
      } else {
        res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
}

export { loginController, forgotPassController, resetPassController };
