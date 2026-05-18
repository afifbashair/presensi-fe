import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/course.css";

export default function CoursePage() {

  const { id } = useParams();

  const [meetings, setMeetings] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const [status, setStatus] =
    useState("");

  const [courseName, setCourseName] =
    useState("");

  const [history, setHistory] =
    useState([]);

  const [campuses, setCampuses] =
    useState([]);

  const [selectedCampus, setSelectedCampus] =
    useState("");

  // ===================================
  // FETCH DATA
  // ===================================

  useEffect(() => {

    // MEETING
    API.get(`/meetings/course/${id}`)
      .then((res) => {

        setMeetings(res.data);

        if (res.data.length > 0) {
          setSelected(res.data[0]);
        }
      });

    // COURSE
    API.get("/courses")
      .then((res) => {

        const course =
          res.data.find(
            (c) => c.id == id
          );

        if (course) {
          setCourseName(course.name);
        }
      });

    // CAMPUS
    API.get("/campus")
      .then((res) => {

        setCampuses(res.data);

        if (res.data.length > 0) {
          setSelectedCampus(
            res.data[0].id
          );
        }
      });

  }, [id]);

  // ===================================
  // FETCH HISTORY
  // ===================================

  useEffect(() => {

    API.get("/attendance/me")
      .then((res) => {

        const filtered =
          res.data.data.filter(
            (item) =>
              item.course_id == id
          );

        setHistory(filtered);
      });

  }, [id]);

  // ===================================
  // CHECK IN
  // ===================================

  const handleCheckIn = () => {

    navigator.geolocation.getCurrentPosition(
      async (pos) => {

        const {
          latitude,
          longitude,
        } = pos.coords;

        try {

          const res =
            await API.post(
              "/attendance/checkin",
              {
                campus_id:
                  selectedCampus,

                course_id: id,

                meeting_id:
                  selected.id,

                latitude,
                longitude,
              }
            );

          setStatus(
            `✅ ${res.data.message} (${res.data.distance} meter)`
          );

          // REFRESH HISTORY
          const historyRes =
            await API.get(
              "/attendance/me"
            );

          const filtered =
            historyRes.data.data.filter(
              (item) =>
                item.course_id == id
            );

          setHistory(filtered);

        } catch (err) {

          setStatus(
            `❌ ${
              err.response?.data
                ?.message
            }`
          );
        }
      }
    );
  };

  // ===================================
  // STATUS PRESENSI
  // ===================================

  const now = new Date();

  const isOpen =
    selected?.start_time &&
    selected?.end_time &&
    new Date(selected.start_time) <= now &&
    new Date(selected.end_time) >= now;

  const alreadyAttend =
    history.some(
      (h) =>
        h.meeting_id ===
        selected?.id
    );

  return (
    <div className="layout">

      <Sidebar />

      <div className="main">

        <Navbar />

        <div className="course-container">

          {/* ======================
              LEFT SIDEBAR
          ====================== */}

          <div className="course-sidebar">

            <h3>
              {courseName || "Course"}
            </h3>

            {meetings.map((m) => (

              <div
                key={m.id}

                className={`menu-item ${
                  selected?.id === m.id
                    ? "active"
                    : ""
                }`}

                onClick={() =>
                  setSelected(m)
                }
              >
                <div>
                  {m.title}
                </div>

                <small>
                  {m.type}
                </small>
              </div>
            ))}
          </div>

          {/* ======================
              CONTENT
          ====================== */}

          <div className="course-content">

            {!selected ? (

              <p>
                Pilih menu di kiri
              </p>

            ) : (

              <>
                <h2>
                  {selected.title}
                </h2>

                {/* JADWAL */}
                <div className="meeting-info">

                  <p>
                    <b>Mulai:</b>{" "}
                    {new Date(
                      selected.start_time
                    ).toLocaleString()}
                  </p>

                  <p>
                    <b>Selesai:</b>{" "}
                    {new Date(
                      selected.end_time
                    ).toLocaleString()}
                  </p>
                </div>

                {/* ======================
                    MATERIAL
                ====================== */}

                {selected.type ===
                  "material" && (

                  <div className="material-box">

                    <h3>
                      Materi Pertemuan
                    </h3>

                    <a
                      href={
                        selected.content
                      }
                      target="_blank"
                    >
                      Buka Materi
                    </a>

                  </div>
                )}

                {/* ======================
                    ATTENDANCE
                ====================== */}

                {selected.type ===
                  "attendance" && (

                  <div className="attendance-box">

                    <h3>
                      Presensi
                    </h3>

                    {/* CAMPUS */}
                    <select
                      value={
                        selectedCampus
                      }

                      onChange={(e) =>
                        setSelectedCampus(
                          e.target.value
                        )
                      }
                    >
                      {campuses.map(
                        (c) => (

                          <option
                            key={c.id}
                            value={c.id}
                          >
                            {c.name}
                          </option>
                        )
                      )}
                    </select>

                    {/* STATUS */}
                    {alreadyAttend ? (

                      <p className="success">
                        ✅ Sudah absen
                      </p>

                    ) : (

                      <>
                        <button
                          onClick={
                            handleCheckIn
                          }

                          disabled={
                            !isOpen
                          }
                        >
                          {isOpen
                            ? "Check In Sekarang"
                            : "Presensi Ditutup"}
                        </button>

                        {!isOpen && (
                          <p className="info">
                            Presensi hanya
                            tersedia sesuai
                            jadwal
                          </p>
                        )}
                      </>
                    )}

                    {/* RESULT */}
                    <p>{status}</p>

                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ======================
            HISTORY
        ====================== */}

        <div className="history-section">

          <h3>
            Riwayat Presensi
          </h3>

          {history.length === 0 ? (

            <p className="empty">
              Belum ada presensi
            </p>

          ) : (

            history.map((item) => (

              <div
                key={item.id}
                className="history-card"
              >
                <div>
                  <b>
                    {
                      item.meeting_name
                    }
                  </b>

                  <p>
                    {
                      item.course_name
                    }
                  </p>
                </div>

                <div className="history-time">
                  {new Date(
                    item.check_in_time
                  ).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}