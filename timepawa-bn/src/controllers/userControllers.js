import User from "../models/user.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error getting users", message: error });
  }
}
