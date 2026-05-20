import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/adminDashboard.css";

export default function AdminDashboard() {

  const navigate =
    useNavigate();

  // =========================
  // STATES
  // =========================

  const [
    users,
    setUsers,
  ] = useState([]);

  const [
    meetings,
    setMeetings,
  ] = useState([]);

  const [
    campuses,
    setCampuses,
  ] = useState([]);

  const [
    attendances,
    setAttendances,
  ] = useState([]);

  const [
    courses,
    setCourses,
  ] = useState([]);


  // =========================
  // FETCH
  // =========================

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData =
    async () => {

      try {

        const userRes =
          await API.get(
            "/users"
          );

        const meetingRes =
          await API.get(
            "/meetings"
          );

        const campusRes =
          await API.get(
            "/campus"
          );

        const attendanceRes =
          await API.get(
            "/attendance"
          );

        const courseRes =
          await API.get(
            "/courses"
          );

        setUsers(
          userRes.data
        );

        setMeetings(
          meetingRes.data
        );

        setCampuses(
          campusRes.data
        );

        setAttendances(
          attendanceRes.data.data
        );

        setCourses(
          courseRes.data
        );

      } catch (err) {

        console.log(err);
      }
    };


  return (

    <div className="layout">

      <Sidebar />

      <div className="main">

        <Navbar />

        <div className="admin-dashboard">

          {/* =========================
              HEADER
          ========================= */}

          <div className="dashboard-header">

            <div>

              <h1>
                Admin Dashboard
              </h1>

              <p>
                Kelola LMS,
                presensi,
                user,
                dan campus
              </p>

            </div>

          </div>


          {/* =========================
              STATS
          ========================= */}

          <div className="stats-grid">

            <div className="stat-card">

              <h2>
                {users.length}
              </h2>

              <p>
                Total User
              </p>

            </div>


            <div className="stat-card">

              <h2>
                {meetings.length}
              </h2>

              <p>
                Total Meeting
              </p>

            </div>


            <div className="stat-card">

              <h2>
                {courses.length}
              </h2>

              <p>
                Total Course
              </p>

            </div>


            <div className="stat-card">

              <h2>
                {campuses.length}
              </h2>

              <p>
                Total Campus
              </p>

            </div>


            <div className="stat-card">

              <h2>
                {attendances.length}
              </h2>

              <p>
                Total Attendance
              </p>

            </div>

          </div>


          {/* =========================
              MENU
          ========================= */}

          <div className="admin-menu">

            {/* MEETING */}
            <div
              className="menu-card"

              onClick={() =>
                navigate(
                  "/admin/meetings"
                )
              }
            >

              <h3>
                Kelola Pertemuan
              </h3>

              <p>
                Tambah,
                edit,
                dan hapus meeting
              </p>

            </div>


            {/* USERS */}
            <div
              className="menu-card"

              onClick={() =>
                navigate(
                  "/admin/users"
                )
              }
            >

              <h3>
                Kelola User
              </h3>

              <p>
                Atur role user
                dan akses
              </p>

            </div>


            {/* CAMPUS */}
            <div
              className="menu-card"

              onClick={() =>
                navigate(
                  "/admin/campus"
                )
              }
            >

              <h3>
                Kelola Campus
              </h3>

              <p>
                Atur geofencing,
                radius,
                dan lokasi
              </p>

            </div>


            {/* COURSE */}
            <div
              className="menu-card"

              onClick={() =>
                navigate(
                  "/admin/courses"
                )
              }
            >

              <h3>
                Kelola Course
              </h3>

              <p>
                Tambah dan edit course
              </p>

            </div>

          </div>


          {/* =========================
              USER TABLE
          ========================= */}

          <div className="table-section">

            <div className="table-header">

              <h2>
                User Terbaru
              </h2>

            </div>

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

                    <td>
                      {u.id}
                    </td>

                    <td>
                      {u.email}
                    </td>

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