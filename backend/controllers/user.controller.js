import { createUser } from "../services/user.service.js";

const createUserController = async (req, res) => {
  try {
    const result = await createUser({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirm_password: req.body.confirm_password,
    });
    return res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createUserController };

