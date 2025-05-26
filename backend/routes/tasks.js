const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controllers/taskController");
const { auth, checkRole } = require("../middleware/auth");

router.post("/", auth, checkRole(["manager"]), createTask);
router.get("/", auth, getTasks);
router.patch("/:id/status", auth, updateTaskStatus);

module.exports = router;
