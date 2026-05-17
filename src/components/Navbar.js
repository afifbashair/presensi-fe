import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { FiLogOut, FiUser } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin =
    user?.roles?.includes("admin") ||
    user?.roles?.includes("teacher");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // 🔥 jangan lupa
    navigate("/login");
  };

  return (
    <div className="navbar">
      <button onClick={() => navigate("/")} className="dashboard-btn">
        Dashboard
      </button>

      {/* 🔥 ADMIN BUTTON */}
      {isAdmin && (
        <button onClick={() => navigate("/admin")} className="dashboard-btn">
          Admin
        </button>
      )}

      <div className="nav-action">
        <button
          onClick={() => navigate("/profile")}
          className="icon-btn"
          title="Profile"
        >
          <FiUser />
        </button>

        <button onClick={logout} className="logout-btn">
          <FiLogOut />
        </button>
      </div>
    </div>
  );
}