import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

import "../styles/navbar.css";

import {
  FiLogOut,
  FiUser,
  FiBell,
} from "react-icons/fi";

export default function Navbar() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // =========================
  // ROLE
  // =========================

  const isAdmin =
    user?.roles?.includes("admin") ||
    user?.roles?.includes("teacher");

  // =========================
  // NOTIFICATION
  // =========================

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  useEffect(() => {

    API.get("/notifications")
      .then((res) => {

        setNotifications(
          res.data
        );
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  const unread =
    notifications.filter(
      (n) => !n.is_read
    ).length;

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  return (
    <div className="navbar">

      {/* LEFT */}
      <div className="nav-left">

        <button
          onClick={() =>
            navigate("/")
          }
          className="dashboard-btn"
        >
          Dashboard
        </button>

        {isAdmin && (
          <button
            onClick={() =>
              navigate("/admin")
            }
            className="dashboard-btn"
          >
            Admin
          </button>
        )}
      </div>

      {/* RIGHT */}
      <div className="nav-action">
        {/* NOTIFICATION */}
          <button
            className="icon-btn"
            onClick={() =>
              navigate("/notifications")
            }
          >
            <FiBell />
            {unread > 0 && (
              <span className="notif-badge">
                {unread}
              </span>
            )}
          </button>

        {/* PROFILE */}
        <button
          onClick={() =>
            navigate("/profile")
          }
          className="icon-btn"
          title="Profile"
        >
          <FiUser />
        </button>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="logout-btn"
        >
          <FiLogOut />
        </button>

      </div>
    </div>
  );
}