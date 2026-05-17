import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/course.css";

export default function CoursePage() {
  const { id } = useParams();

  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [courseName, setCourseName] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    API.get(`/meetings/course/${id}`).then((res) => {
      setMeetings(res.data);
      if (res.data.length > 0) setSelected(res.data[0]);
    });

    API.get("/courses").then((res) => {
      const course = res.data.find((c) => c.id == id);
      if (course) setCourseName(course.name);
    });
  }, [id]);

  useEffect(() => {
    API.get(`/attendance/me`).then((res) => {
      const filtered = res.data.data.filter(
        (item) => item.course_id == id
      );
      setHistory(filtered);
    });
  }, [id]);

  // 🔴 CHECK IN
  const handleCheckIn = () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const res = await API.post("/attendance/checkin", {
          campus_id: 1,
          course_id: id,
          meeting_id: selected.id,
          latitude,
          longitude,
        });

        setStatus(`✅ ${res.data.message}`);
      } catch (err) {
        setStatus(`❌ ${err.response?.data?.message}`);
      }
    });
  };

  // 🧠 CEK STATUS
  const now = new Date();

  const isOpen =
    selected?.start_time &&
    selected?.end_time &&
    new Date(selected.start_time) <= now &&
    new Date(selected.end_time) >= now;

  const alreadyAttend = history.some(
    (h) => h.meeting_id === selected?.id
  );

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="course-container">
          {/* LEFT MENU */}
          <div className="course-sidebar">
            <h3>{courseName || "Course"}</h3>

            {meetings.map((m) => (
              <div
                key={m.id}
                className={`menu-item ${
                  selected?.id === m.id ? "active" : ""
                }`}
                onClick={() => setSelected(m)}
              >
                {m.title}
              </div>
            ))}
          </div>

          {/* RIGHT CONTENT */}
          <div className="course-content">
            {!selected ? (
              <p>Pilih menu di kiri</p>
            ) : (
              <>
                <h2>{selected.title}</h2>

                {/* 🟦 MATERI */}
                {selected.type === "material" && (
                  <div className="material-box">
                    <p>Materi pertemuan:</p>
                    <a href={selected.content} target="_blank">
                      Buka Materi
                    </a>
                  </div>
                )}

                {/* 🟥 PRESENSI */}
                {selected.type === "attendance" && (
                  <div className="attendance-box">
                    {alreadyAttend ? (
                      <p className="success">
                        ✅ Sudah absen di pertemuan ini
                      </p>
                    ) : (
                      <>
                        <button
                          onClick={handleCheckIn}
                          disabled={!isOpen}
                        >
                          {isOpen
                            ? "Check In Sekarang"
                            : "Presensi Ditutup"}
                        </button>

                        {!isOpen && (
                          <p className="info">
                            Presensi hanya tersedia sesuai jadwal
                          </p>
                        )}
                      </>
                    )}

                    <p>{status}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* HISTORY */}
        <div className="history-section">
          <h3>Riwayat Presensi</h3>

          {history.length === 0 ? (
            <p className="empty">Belum ada presensi</p>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-card">
                <div>
                  <b>{item.meeting_name}</b>
                  <p>{item.course_name}</p>
                </div>

                <div className="history-time">
                  {new Date(item.check_in_time).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}