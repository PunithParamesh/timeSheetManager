const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    console.log("Registration attempt:", { username, email, role }); 

    
    if (!username || !password || !email || !role) {
      console.log("Missing required fields"); 
      return res.status(400).json({
        message: "All fields are required",
        missing: {
          username: !username,
          password: !password,
          email: !email,
          role: !role,
        },
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("User already exists:", { email, username }); 
      return res.status(400).json({
        message: "User already exists",
        field: existingUser.email === email ? "email" : "username",
      });
    }

   
    const user = new User({
      username,
      password,
      email,
      role,
    });

    await user.save();
    console.log("User created successfully:", user._id); 


    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

   
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
