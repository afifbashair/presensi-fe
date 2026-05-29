import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CoursePage from "./pages/CoursePage";
import AdminDashboard from "./pages/AdminDashboard";
import ManageMeeting from "./pages/ManageMeeting";
import ManageUsers from "./pages/ManageUsers";
import Profile from "./pages/Profile";
import ManageCourses from "./pages/ManageCourses";
import NotificationsPage from "./pages/NotificationsPage";
import ManageCampus from "./pages/ManageCampus";
import AttendanceReport from "./pages/AttendanceReport";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin =
    user?.roles?.includes("admin") ||
    user?.roles?.includes("teacher");

  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/course/:id"
          element={
            <PrivateRoute>
              <CoursePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/meetings"
          element={
            <PrivateRoute>
              <AdminRoute>
                <ManageMeeting />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <PrivateRoute>
              <ManageCourses />
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <NotificationsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/campus"
          element={
            <PrivateRoute>
              <ManageCampus />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <PrivateRoute>
              <AttendanceReport />
            </PrivateRoute>
          }
        />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;