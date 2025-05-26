import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import taskService from "../services/task.service";
import timesheetService from "../services/timesheet.service";
import { useAuth } from "../context/AuthContext";


const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date)
    ? date.toLocaleDateString()
    : "Invalid Date";
};

const AssociateDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const [newTimesheet, setNewTimesheet] = useState({
    actualHours: "",
    notes: "",
  });

  useEffect(() => {
    fetchAssignedTasks();
    fetchUserTimesheets();
  }, []);

  const fetchAssignedTasks = async () => {
    try {
      const response = await taskService.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
      setErrorMessage("Failed to load assigned tasks");
    }
  };

  const fetchUserTimesheets = async () => {
    try {
      const response = await timesheetService.getUserTimesheets(user.id);
      setTimesheets(response.data);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      setErrorMessage("Failed to load timesheets");
    }
  };

  const handleCreateTimesheet = async () => {
    try {
      if (!selectedTask) {
        setErrorMessage("Please select a task");
        return;
      }

      await timesheetService.create({
        task: selectedTask._id,
        date: selectedDate,
        actualHours: newTimesheet.actualHours,
        notes: newTimesheet.notes,
      });

      setOpenDialog(false);
      setErrorMessage("");
      fetchUserTimesheets();
      setNewTimesheet({
        actualHours: "",
        notes: "",
      });
      setSelectedTask(null);
    } catch (error) {
      console.error("Error creating timesheet:", error);
      setErrorMessage("Failed to create timesheet");
    }
  };

  const handleSubmitTimesheet = async (timesheetId) => {
    try {
      await timesheetService.submitForApproval(timesheetId);
      fetchUserTimesheets();
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      setErrorMessage("Failed to submit timesheet");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Associate Dashboard
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create Timesheet Entry
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Assigned Tasks */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Assigned Tasks
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Estimated Hours</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{formatDate(task.taskDate)}</TableCell>
                      <TableCell>{task.estimatedHours}</TableCell>
                      <TableCell>{task.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Timesheet History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Timesheet History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Task</TableCell>
                    <TableCell>Hours</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {timesheets.map((timesheet) => (
                    <TableRow key={timesheet._id}>
                      <TableCell>{formatDate(timesheet.date)}</TableCell>
                      <TableCell>{timesheet.task?.description}</TableCell>
                      <TableCell>{timesheet.actualHours}</TableCell>
                      <TableCell>{timesheet.status}</TableCell>
                      <TableCell>
                        {timesheet.status === "draft" && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleSubmitTimesheet(timesheet._id)}
                          >
                            Submit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create Timesheet Entry</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="normal" />
              )}
            />
          </LocalizationProvider>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Task"
            value={selectedTask?._id || ""}
            onChange={(e) => {
              const task = tasks.find((t) => t._id === e.target.value);
              setSelectedTask(task);
            }}
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.description}
              </option>
            ))}
          </TextField>
          <TextField
            margin="normal"
            label="Hours"
            type="number"
            fullWidth
            value={newTimesheet.actualHours}
            onChange={(e) =>
              setNewTimesheet({ ...newTimesheet, actualHours: e.target.value })
            }
          />
          <TextField
            margin="normal"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={newTimesheet.notes}
            onChange={(e) =>
              setNewTimesheet({ ...newTimesheet, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateTimesheet}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssociateDashboard;
