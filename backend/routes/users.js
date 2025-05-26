const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");
const { auth } = require("../middleware/auth"); 

// Route to get all users
router.get("/", auth, getAllUsers); // Updated middleware usage

module.exports = router;
