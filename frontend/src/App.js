import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ManagerDashboard from "./pages/ManagerDashboard";
import AssociateDashboard from "./pages/AssociateDashboard";
import Navbar from "./components/Navbar";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/dashboard/${user.role}`} />;
  }

  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={`/dashboard/${user.role}`} />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Manager Dashboard */}
            <Route
              path="/dashboard/manager/*"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <>
                  <Navbar />
                  <ManagerDashboard />
                  </>
                  
                </ProtectedRoute>
              }
            />

            {/* Associate Dashboard */}
            <Route
              path="/dashboard/associate/*"
              element={
                <ProtectedRoute allowedRoles={["associate"]}>
                  <>
                  <Navbar />
                  <AssociateDashboard />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Root path redirect */}
            <Route path="/" element={<DashboardRedirect />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
