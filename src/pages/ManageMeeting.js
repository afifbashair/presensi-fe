import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import "../styles/admin.css";


// =====================================
// FORMAT DATETIME FOR DATABASE
// =====================================

const formatLocalDateTime = (
  dateTime
) => {

  if (!dateTime) return "";

  return dateTime
    .replace("T", " ")
    + ":00";
};

// =====================================
// FORMAT DATETIME FOR INPUT
// =====================================

const formatDateTimeLocal = (
  dateTime
) => {

  if (!dateTime) return "";

  const date = new Date(dateTime);

  // WIB offset
  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
      offset * 60000
    );

  return localDate
    .toISOString()
    .slice(0, 16);
};

export default function ManageMeeting() {

  // =====================================
  // STATES
  // =====================================

  const [
    meetings,
    setMeetings,
  ] = useState([]);

  const [
    courses,
    setCourses,
  ] = useState([]);

  const [
    selectedCourse,
    setSelectedCourse,
  ] = useState("");

  const [
    editId,
    setEditId,
  ] = useState(null);

  const [
    form,
    setForm,
  ] = useState({

    course_id: "",

    title: "",

    type: "attendance",

    content: "",

    start_time: "",

    end_time: "",
  });


  // =====================================
  // FETCH DATA
  // =====================================

  const fetchData =
    async () => {

      try {

        const meetingRes =
          await API.get(
            "/meetings"
          );

        const courseRes =
          await API.get(
            "/courses"
          );

        setMeetings(
          meetingRes.data
        );

        setCourses(
          courseRes.data
        );

      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);


  // =====================================
  // CREATE / UPDATE
  // =====================================

  const handleSubmit =
    async () => {

      try {

        // FORMAT TIME
        const payload = {

          ...form,

          start_time:
            formatLocalDateTime(
              form.start_time
            ),

          end_time:
            formatLocalDateTime(
              form.end_time
            ),
        };

        // UPDATE
        if (editId) {

          await API.put(
            `/meetings/${editId}`,
            payload
          );

          alert(
            "Meeting berhasil diupdate"
          );

        } else {

          // CREATE
          await API.post(
            "/meetings",
            payload
          );

          alert(
            "Meeting berhasil ditambahkan"
          );
        }

        // RESET
        setForm({

          course_id: "",

          title: "",

          type: "attendance",

          content: "",

          start_time: "",

          end_time: "",
        });

        setEditId(null);

        fetchData();

      } catch (err) {

        alert(
          err.response?.data?.message ||
          "Terjadi kesalahan"
        );
      }
    };


  // =====================================
  // DELETE
  // =====================================

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Hapus meeting ini?"
        );

      if (!confirmDelete)
        return;

      try {

        await API.delete(
          `/meetings/${id}`
        );

        fetchData();

      } catch (err) {
        console.log(err);
      }
    };


  // =====================================
  // EDIT
  // =====================================

  const handleEdit =
    (m) => {

      setForm({

        course_id:
          m.course_id,

        title:
          m.title,

        type:
          m.type,

        content:
          m.content || "",

        start_time:
          formatDateTimeLocal(
            m.start_time
          ),

        end_time:
          formatDateTimeLocal(
            m.end_time
          ),
      });

      setEditId(m.id);

      // SCROLL TOP
      window.scrollTo({

        top: 0,

        behavior: "smooth",
      });
    };


  // =====================================
  // FILTER
  // =====================================

  const filteredMeetings =
    selectedCourse

      ? meetings.filter(
          (m) =>
            m.course_id ==
            selectedCourse
        )

      : meetings;


  // =====================================
  // RENDER
  // =====================================

  return (

    <div className="admin-container">

      <h2>
        Kelola Pertemuan
      </h2>

      {/* =========================
          FORM
      ========================= */}

      <div className="admin-form">

        {/* COURSE */}
        <select
          value={form.course_id}
          onChange={(e) =>
            setForm({

              ...form,

              course_id:
                e.target.value,
            })
          }
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


        {/* TITLE */}
        <input
          placeholder="Judul Pertemuan"

          value={form.title}

          onChange={(e) =>
            setForm({

              ...form,

              title:
                e.target.value,
            })
          }
        />


        {/* TYPE */}
        <select
          value={form.type}

          onChange={(e) =>
            setForm({

              ...form,

              type:
                e.target.value,
            })
          }
        >

          <option value="attendance">
            Presensi
          </option>

          <option value="material">
            Materi
          </option>
        </select>


        {/* CONTENT */}
        <input
          placeholder="Link Materi"

          value={form.content}

          onChange={(e) =>
            setForm({

              ...form,

              content:
                e.target.value,
            })
          }
        />


        {/* START */}
        <input
          type="datetime-local"

          value={form.start_time}

          onChange={(e) =>
            setForm({

              ...form,

              start_time:
                e.target.value,
            })
          }
        />


        {/* END */}
        <input
          type="datetime-local"

          value={form.end_time}

          onChange={(e) =>
            setForm({

              ...form,

              end_time:
                e.target.value,
            })
          }
        />


        {/* BUTTON */}
        <button
          onClick={handleSubmit}
        >
          {editId
            ? "Update Meeting"
            : "Tambah Meeting"}
        </button>

      </div>


      {/* =========================
          FILTER
      ========================= */}

      <div className="filter-section">

        <select
          value={selectedCourse}

          onChange={(e) =>
            setSelectedCourse(
              e.target.value
            )
          }
        >

          <option value="">
            Semua Course
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

      </div>


      {/* =========================
          TABLE
      ========================= */}

      <table className="admin-table">

        <thead>

          <tr>

            <th>ID</th>

            <th>Course</th>

            <th>Judul</th>

            <th>Tipe</th>

            <th>Mulai</th>

            <th>Selesai</th>

            <th>Aksi</th>

          </tr>

        </thead>


        <tbody>

          {filteredMeetings.map(
            (m) => {

              const course =
                courses.find(
                  (c) =>
                    c.id ===
                    m.course_id
                );

              return (

                <tr key={m.id}>

                  <td>
                    {m.id}
                  </td>

                  <td>
                    {course?.name ||
                      "Unknown"}
                  </td>

                  <td>
                    {m.title}
                  </td>

                  <td>
                    {m.type}
                  </td>

                  <td>
                    {new Date(
                      m.start_time
                    ).toLocaleString(
                      "id-ID",
                      {
                        timeZone:
                          "Asia/Jakarta",
                      }
                    )}
                  </td>

                  <td>
                    {new Date(
                      m.end_time
                    ).toLocaleString(
                      "id-ID",
                      {
                        timeZone:
                          "Asia/Jakarta",
                      }
                    )}
                  </td>

                  <td>

                    <button
                      className="edit-btn"

                      onClick={() =>
                        handleEdit(m)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"

                      onClick={() =>
                        handleDelete(
                          m.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              );
            }
          )}

        </tbody>

      </table>

    </div>
  );
}