import { useEffect, useState } from "react";
import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/admin.css";

export default function AttendanceReport() {
  const [courses, setCourses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [summary, setSummary] = useState(null);
  const [present, setPresent] = useState([]);
  const [absent, setAbsent] = useState([]);

  useEffect(() => {
    API.get("/courses")
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  // LOAD MEETING
  const loadMeetings = async (courseId) => {
    try {
      const res = await API.get(
        `/meetings/course/${courseId}`
      );

      setMeetings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // LOAD DETAIL
  const loadDetail = async (meetingId) => {
    try {
      const summaryRes = await API.get(
        `/attendance/meeting/${meetingId}/summary`
      );

      const presentRes = await API.get(
        `/attendance/meeting/${meetingId}/present`
      );

      const absentRes = await API.get(
        `/attendance/meeting/${meetingId}/absent`
      );

      setSummary(summaryRes.data);
      setPresent(presentRes.data.students);
      setAbsent(absentRes.data.students);

    } catch (err) {
      console.log(err);
    }
  };

  // EXPORT EXCEL
  const exportExcel = async () => {
    try {
      const res = await API.get(
        `/attendance/meeting/${selectedMeeting.id}/export`,
        {
          responseType: "blob",
        }
      );

      const url =
        window.URL.createObjectURL(
          new Blob([res.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `rekap-${selectedMeeting.title}.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.log(err);
      alert("Gagal export excel");
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="admin-container">
          <h2>Rekap Presensi</h2>

          {/* COURSE */}
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(
                e.target.value
              );

              loadMeetings(
                e.target.value
              );
            }}
          >
            <option value="">
              Pilih Course
            </option>

            {courses.map((c) => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>

          <br />
          <br />

          {/* LIST MEETING */}
          {meetings.map((m) => (
            <div
              key={m.id}
              className="history-card"
            >
              <div>
                <b>{m.title}</b>
              </div>

              <button
                onClick={() => {
                  setSelectedMeeting(m);
                  loadDetail(m.id);
                }}
              >
                Detail
              </button>
            </div>
          ))}

          {/* DETAIL */}
          {selectedMeeting && summary && (
            <>
              <hr />

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h3>
                  {selectedMeeting.title}
                </h3>

                <button
                  className="export-btn"
                  onClick={exportExcel}
                >
                  📊 Export Excel
                </button>
              </div>

              {/* SUMMARY */}
              <div className="stats-grid">
                <div className="stat-card">
                  <h2>
                    {
                      summary.total_participant
                    }
                  </h2>
                  <p>Peserta</p>
                </div>

                <div className="stat-card">
                  <h2>
                    {
                      summary.total_present
                    }
                  </h2>
                  <p>Hadir</p>
                </div>

                <div className="stat-card">
                  <h2>
                    {
                      summary.total_absent
                    }
                  </h2>
                  <p>Tidak Hadir</p>
                </div>

                <div className="stat-card">
                  <h2>
                    {
                      summary.attendance_percentage
                    }
                    %
                  </h2>
                  <p>Kehadiran</p>
                </div>
              </div>

              <br />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "20px",
                }}
              >
                {/* HADIR */}
                <div>
                  <h3>
                    ✅ Sudah Hadir
                  </h3>

                  {present.map((p) => (
                    <div
                      key={p.id}
                      className="history-card"
                    >
                      <div>
                        {p.email}
                      </div>

                      <small>
                        {new Date(
                          p.check_in_time
                        ).toLocaleString(
                          "id-ID"
                        )}
                      </small>
                    </div>
                  ))}
                </div>

                {/* TIDAK HADIR */}
                <div>
                  <h3>
                    ❌ Belum Hadir
                  </h3>

                  {absent.map((a) => (
                    <div
                      key={a.id}
                      className="history-card"
                    >
                      {a.email}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}