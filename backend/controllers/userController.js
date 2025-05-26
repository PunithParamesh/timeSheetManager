const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "_id username email"); 
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = {
  getAllUsers,
};
