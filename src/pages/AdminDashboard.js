import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/adminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [meetings, setMeetings] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/users").then((res) => setUsers(res.data));

    API.get("/meetings").then((res) => setMeetings(res.data));
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="admin-dashboard">
          <h1>Admin Dashboard</h1>

          {/* STATS */}
          <div className="stats-grid">
            <div className="stat-card">
              <h2>{users.length}</h2>
              <p>Total User</p>
            </div>

            <div className="stat-card">
              <h2>{meetings.length}</h2>
              <p>Total Meeting</p>
            </div>

            <div className="stat-card">
              <h2>3</h2>
              <p>Total Course</p>
            </div>
          </div>

          {/* MENU */}
          <div className="admin-menu">
            <div
              className="menu-card"
              onClick={() => navigate("/admin/meetings")}
            >
              <h3>Kelola Pertemuan</h3>
              <p>Tambah, edit, dan hapus meeting</p>
            </div>

            <div
              className="menu-card"
              onClick={() => navigate("/admin/users")}
            >
              <h3>Kelola User</h3>
              <p>Atur role user dan akses</p>
            </div>
          </div>

          {/* USER TABLE */}
          <div className="table-section">
            <h2>User Terbaru</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}