import { useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin =
    user?.roles?.includes("admin") ||
    user?.roles?.includes("teacher");

  return (
    <div className="sidebar">
      <h2>E-Learning</h2>

      <ul>
        <li onClick={() => navigate("/")}>Dashboard</li>
        <li onClick={() => navigate("/")}>My Courses</li>
        <li>Calendar</li>

        {/* 🔥 ADMIN MENU */}
        {isAdmin && (
          <>
            <hr />
            <p className="sidebar-label">Admin</p>

            <li onClick={() => navigate("/admin")}>
              Dashboard Admin
            </li>

            <li onClick={() => navigate("/admin/meetings")}>
              Kelola Pertemuan
            </li>
            
            <li onClick={() => navigate("/admin/users")}>
              Kelola User
            </li>
          </>
        )}
      </ul>
    </div>
  );
}