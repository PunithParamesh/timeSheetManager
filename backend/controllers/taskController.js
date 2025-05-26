const Task = require("../models/Task");
const User = require("../models/User");

const createTask = async (req, res) => {
  try {
    console.log("Request Body:", req.body); 
    console.log("User Info:", req.user);

    const { description, assignedTo, estimatedHours, taskDate } = req.body;

    
    if (!description || !assignedTo || !estimatedHours || !taskDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(400).json({ message: "Assigned user does not exist" });
    }

    const task = new Task({
      description,
      assignedTo,
      assignedBy: req.user.id,
      estimatedHours,
      taskDate,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error); 
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { role } = req.user;
    const query =
      role === "manager"
        ? { assignedBy: req.user.id }
        : { assignedTo: req.user.id };

    const tasks = await Task.find(query)
      .populate("assignedTo", "username email")
      .populate("assignedBy", "username email")
      .sort({ taskDate: -1 });

    res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      req.user.role === "associate" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
};
