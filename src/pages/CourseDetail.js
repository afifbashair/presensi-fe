import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function CourseDetail() {
  const { id } = useParams();

  const [meetings, setMeetings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    API.get(`/meetings/course/${id}`).then((res) => {
      setMeetings(res.data);
    });
  }, [id]);

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
        setStatus(`❌ ${err.response.data.message}`);
      }
    });
  };

  return (
    <div>
      <h2>Course Detail</h2>

      {/* LIST MENU */}
      <div>
        {meetings.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            style={{
              cursor: "pointer",
              padding: 10,
              border: "1px solid #ccc",
              marginBottom: 5,
            }}
          >
            {m.title}
          </div>
        ))}
      </div>

      <hr />

      {/* CONTENT */}
      {selected && (
        <div>
          <h2>{selected.title}</h2>

            {/* MATERI */}
            {selected.type === "material" && (
            <a href={selected.content}>Buka Materi</a>
            )}

            {/* PRESENSI SELALU ADA */}
            <button onClick={handleCheckIn}>
            Absen Pertemuan Ini
            </button>
        </div>
      )}
    </div>
  );
}