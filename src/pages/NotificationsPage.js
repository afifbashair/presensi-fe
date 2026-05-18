import { useEffect, useState } from "react";

import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/notification.css";

export default function NotificationsPage() {

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  // =========================
  // FETCH
  // =========================

  const fetchNotifications =
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
    fetchNotifications();
  }, []);

  // =========================
  // MARK AS READ
  // =========================

  const markAsRead =
    async (id) => {

      try {

        await API.put(
          `/notifications/${id}/read`
        );

        fetchNotifications();

      } catch (err) {
        console.log(err);
      }
    };

  // =========================
  // DELETE
  // =========================

  const deleteNotification =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Hapus notifikasi?"
        );

      if (!confirmDelete) return;

      await API.delete(
        `/notifications/${id}`
      );

      fetchNotifications();
    };

  return (
    <div className="layout">

      <Sidebar />

      <div className="main">

        <Navbar />

        <div className="notification-container">

          <h2>
            Notifications
          </h2>

          {notifications.length === 0 ? (

            <div className="empty-notif">
              Tidak ada notifikasi
            </div>

          ) : (

            notifications.map((n) => (

              <div
                key={n.id}

                className={`notif-card ${
                  !n.is_read
                    ? "unread"
                    : ""
                }`}
              >

                <div className="notif-content">

                  <h3>
                    {n.title}
                  </h3>

                  <p>
                    {n.message}
                  </p>

                  <small>
                    {new Date(
                      n.createdAt
                    ).toLocaleString()}
                  </small>

                </div>

                <div className="notif-action">

                  {!n.is_read && (
                    <button
                      className="read-btn"
                      onClick={() =>
                        markAsRead(
                          n.id
                        )
                      }
                    >
                      Read
                    </button>
                  )}

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteNotification(
                        n.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}