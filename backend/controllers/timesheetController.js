const Timesheet = require("../models/Timesheet");

const createTimesheet = async (req, res) => {
  try {
    const { task, actualHours, date, notes } = req.body;

    const timesheet = new Timesheet({
      user: req.user.id,
      task,
      actualHours,
      date,
      notes,
    });

    await timesheet.save();
    res.status(201).json(timesheet);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating timesheet", error: error.message });
  }
};

const getTimesheets = async (req, res) => {
  try {
    // const { role } = req.user;
    // const { startDate, endDate } = req.query;

    // let query = role === "manager" ? {} : { user: req.user.id };

    // if (startDate && endDate) {
    //   query.date = {
    //     $gte: new Date(startDate),
    //     $lte: new Date(endDate),
    //   };
    // }

    const timesheets = await Timesheet.find({})
      .populate("user", "username email")
      .populate("task")
      .sort({ date: -1 });
    
      console.log("Timesheet json", timesheets.map(ts => ts.toJSON()));
    res.json(timesheets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching timesheets", error: error.message });
  }
};

const getUserTimesheets = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { startDate, endDate } = req.query;

    let query = { user: userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const timesheets = await Timesheet.find(query)
      .populate("user", "username email")
      .populate("task")
      .sort({ date: -1 });

    res.json(timesheets);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user timesheets",
      error: error.message,
    });
  }
};

const submitTimesheet = async (req, res) => {
  try {
    const timesheet = await Timesheet.findById(req.params.id);

    if (!timesheet) {
      return res.status(404).json({ message: "Timesheet not found" });
    }

    if (timesheet.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to submit this timesheet" });
    }
    if (timesheet.status === "submitted") {
      return res.status(400).json({ message: "Timesheet already submitted" });
    }

    timesheet.status = "submitted";
    await timesheet.save();

    
    const updatedTimesheet = await Timesheet.findById(timesheet._id)
      .populate("user", "username email")
      .populate("task");
    res.json(updatedTimesheet);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting timesheet", error: error.message });
  }
};

module.exports = {
  createTimesheet,
  getTimesheets,
  submitTimesheet,
  getUserTimesheets,
};
