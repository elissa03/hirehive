import { createUser, getUserById } from "../services/user.service.js";

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

/**
 * Controller for fetching a user by ID.
 * @param {Object} req - The request object from Express.js.
 * @param {Object} res - The response object from Express.js.
 * @returns {Promise<void>}
 */
const getUserByIdController = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getUserById(userId);
    switch (result.status) {
      case 200:
        return res.status(200).json(result.data);
      case 400:
        return res.status(400).json({ message: result.message });
      case 404:
        return res.status(404).json({ message: result.message });
      default:
        return res.status(500).json({ message: "Unexpected status code" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export { createUserController, getUserByIdController };

