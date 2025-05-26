const express = require("express");
const router = express.Router();
const {
  createTimesheet,
  getTimesheets,
  submitTimesheet,
  getUserTimesheets,
} = require("../controllers/timesheetController");
const { auth } = require("../middleware/auth");

router.post("/", auth, createTimesheet);
router.get("/", auth, getTimesheets);
router.get("/user/:userId", auth, getUserTimesheets);
router.patch("/:id/submit", auth, submitTimesheet);

module.exports = router;
