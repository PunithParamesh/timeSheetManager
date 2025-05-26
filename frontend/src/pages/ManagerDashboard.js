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
  Tab,
  Tabs,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import taskService from "../services/task.service";
import timesheetService from "../services/timesheet.service";
import userService from "../services/user.service";
import { useAuth } from "../context/AuthContext";

function TabPanel({ children, value, index }) {
  return value === index && <Box sx={{ p: 3 }}>{children}</Box>;
}

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [tasks, setTasks] = useState([
    {
      description: "a",
      assignedTo: "a",
      estimatedHours: "2",
      taskDate: new Date(),
      status: "pending",
      _id: "",
    },
  ]);
  const [timesheets, setTimesheets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [newTask, setNewTask] = useState({
    description: "",
    assignedTo: "",
    estimatedHours: "",
    taskDate: new Date(), 
  });
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    fetchTasks();
    fetchTimesheets();
    fetchUsers(); 
  }, [startDate, endDate]);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchTimesheets = async () => {
    try {
      const response = await timesheetService.getAll(startDate, endDate);
      setTimesheets(response.data);
    } catch (error) {
      console.error("Error fetching timesheets:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateTask = async () => {
    try {
      await taskService.create(newTask);
      setOpenDialog(false);
      fetchTasks();
      setNewTask({
        description: "",
        assignedTo: "",
        estimatedHours: "",
        taskDate: new Date(), 
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleApproveTimesheet = async (timesheetId) => {
    try {
      await timesheetService.approveTimesheet(timesheetId);
      fetchTimesheets();
    } catch (error) {
      console.error("Error approving timesheet:", error);
    }
  };

  const handleRejectTimesheet = async (timesheetId) => {
    try {
      await timesheetService.rejectTimesheet(timesheetId);
      fetchTimesheets();
    } catch (error) {
      console.error("Error rejecting timesheet:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manager Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab label="Tasks" />
          <Tab label="Timesheets" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Create New Task
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Estimated Hours</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    {typeof task.assignedTo === "object"
                      ? `${task.assignedTo.username} (${task.assignedTo.email})`
                      : task.assignedTo}
                  </TableCell>
                  <TableCell>{task.estimatedHours}</TableCell>
                  <TableCell>
                    {task.taskDate
                      ? new Date(task.taskDate).toLocaleDateString()
                      : ""}
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Task</TableCell>
                <TableCell>Hours</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timesheets.map((timesheet) => (
                <TableRow key={timesheet._id}>
                  <TableCell>
                    {new Date(timesheet.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{timesheet.user?.name}</TableCell>
                  <TableCell>{timesheet.task?.description}</TableCell>
                  <TableCell>{timesheet.actualHours}</TableCell>
                  <TableCell>{timesheet.status}</TableCell>
                  <TableCell>
                    {timesheet.status === "pending" && (
                      <Box>
                        <Button
                          size="small"
                          color="success"
                          onClick={() => handleApproveTimesheet(timesheet._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRejectTimesheet(timesheet._id)}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <TextField
            select
            margin="dense"
            label="Assigned To"
            fullWidth
            value={newTask.assignedTo}
            onChange={(e) =>
              setNewTask({ ...newTask, assignedTo: e.target.value })
            }
            SelectProps={{
              native: true,
            }}
            sx={{ mt: 2, mb: 2 }}
          >
            <option value=""></option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Estimated Hours"
            type="number"
            fullWidth
            value={newTask.estimatedHours}
            onChange={(e) =>
              setNewTask({ ...newTask, estimatedHours: e.target.value })
            }
            sx={{ mb: 3 }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Due Date"
              value={newTask.taskDate}
              onChange={(newValue) =>
                setNewTask({ ...newTask, taskDate: newValue })
              }
              renderInput={(params) => (
                <TextField {...params} fullWidth margin="dense" />
              )}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateTask}
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

export default ManagerDashboard;
