import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

import "../styles/navbar.css";

import {
  FiLogOut,
  FiUser,
  FiBell,
} from "react-icons/fi";

export default function Navbar() {

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // =========================
  // ROLE
  // =========================

  const isAdmin =
    user?.roles?.includes(
      "admin"
    ) ||
    user?.roles?.includes(
      "teacher"
    );

  // =========================
  // NOTIFICATION
  // =========================

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    showNotif,
    setShowNotif,
  ] = useState(false);

  const fetchNotif =
    async () => {

      try {

        const res =
          await API.get(
            "/notifications"
          );

        setNotifications(
          res.data
        );

      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {
    fetchNotif();
  }, []);

  // =========================
  // UNREAD COUNT
  // =========================

  const unread =
    notifications.filter(
      (n) => !n.is_read
    ).length;

  // =========================
  // READ
  // =========================

  const markAsRead =
    async (id) => {

      await API.put(
        `/notifications/${id}/read`
      );

      fetchNotif();
    };

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
          className="dashboard-btn"
          onClick={() =>
            navigate("/")
          }
        >
          Dashboard
        </button>

        {isAdmin && (
          <button
            className="dashboard-btn"
            onClick={() =>
              navigate("/admin")
            }
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
              setShowNotif(
                !showNotif
              )
            }
          >
            <FiBell />

            {unread > 0 && (
              <span className="notif-badge">
                {unread}
              </span>
            )}
          </button>

          {/* DROPDOWN */}
          {showNotif && (

            <div className="notif-dropdown">

              <div className="notif-header">
                Notifications
              </div>

              {notifications.length === 0 ? (

                <div className="empty-notif">
                  Tidak ada notifikasi
                </div>

              ) : (

                notifications
                  .slice(0, 5)
                  .map((n) => (

                    <div
                      key={n.id}

                      className={`notif-item ${
                        !n.is_read
                          ? "unread"
                          : ""
                      }`}

                      onClick={() =>
                        markAsRead(
                          n.id
                        )
                      }
                    >

                      <h4>
                        {n.title}
                      </h4>

                      <p>
                        {n.message}
                      </p>

                    </div>
                  ))
              )}

              <button
                className="see-all-btn"
                onClick={() =>
                  navigate(
                    "/notifications"
                  )
                }
              >
                Lihat Semua
              </button>

            </div>
          )}

        {/* PROFILE */}
        <button
          onClick={() =>
            navigate("/profile")
          }
          className="icon-btn"
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