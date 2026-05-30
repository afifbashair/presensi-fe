import { useEffect, useState } from "react";
import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/admin.css";

export default function ManageEnrollment() {
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);

  const [courseId, setCourseId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  // LOAD COURSE & USER
  const loadData = async () => {
    try {
      const courseRes =
        await API.get("/courses");

      const userRes =
        await API.get("/users");

      setCourses(courseRes.data);
      setUsers(userRes.data);

    } catch (err) {
      console.log(err);
    }
  };

  // LOAD PESERTA COURSE
  const loadStudents = async (
    selectedCourseId
  ) => {
    try {

      const res =
        await API.get(
          `/courses/${selectedCourseId}/students`
        );

      console.log(
        "STUDENTS:",
        res.data
      );

      setStudents(
        res.data
      );

    } catch (err) {
      console.log(err);

      setStudents([]);
    }
  };

  // TAMBAH PESERTA
  const handleEnroll =
    async () => {
      try {

        if (
          !courseId ||
          !userId
        ) {
          return alert(
            "Pilih course dan user terlebih dahulu"
          );
        }

        await API.post(
          "/courses/enroll",
          {
            course_id:
              courseId,
            user_id:
              userId,
          }
        );

        alert(
          "Peserta berhasil ditambahkan"
        );

        setUserId("");

        // refresh list peserta
        loadStudents(
          courseId
        );

      } catch (err) {

        alert(
          err.response?.data
            ?.message ||
            "Gagal menambahkan peserta"
        );
      }
    };

    const handleRemove = async (
        courseId,
        userId
        ) => {
        try {

            console.log(
            "DELETE",
            `/courses/${courseId}/participant/${userId}`
            );

            const res =
            await API.delete(
            `/courses/${courseId}/participant/${userId}`
            );

            console.log(res.data);

            loadStudents(courseId);

        } catch (err) {

            console.log(
            err.response?.data
            );

            alert(
            err.response?.data?.message ||
            "Gagal menghapus"
            );
        }
        };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="admin-container">
          <h2>
            Kelola Peserta Course
          </h2>

          {/* FORM */}
          <div className="admin-form">

            {/* COURSE */}
            <select
              value={courseId}
              onChange={(e) => {

                setCourseId(
                  e.target.value
                );

                loadStudents(
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

            {/* USER */}
            <select
              value={userId}
              onChange={(e) =>
                setUserId(
                  e.target.value
                )
              }
            >
              <option value="">
                Pilih User
              </option>

              {users.map((u) => (
                <option
                  key={u.id}
                  value={u.id}
                >
                  {u.email}
                </option>
              ))}
            </select>

            <button
              onClick={
                handleEnroll
              }
            >
              Tambahkan
            </button>

          </div>

          <hr />

          {/* LIST PESERTA */}
          <h3>
            Peserta Terdaftar
          </h3>

          {!courseId ? (
            <p>
              Pilih course terlebih dahulu
            </p>
          ) : students.length === 0 ? (
            <p>
              Belum ada peserta
            </p>
          ) : (
            <table className="admin-table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Aksi</th>
                    </tr>
                </thead>

                <tbody>

                    {students.map(
                    (student) => (
                        <tr
                        key={student.id}
                        >
                        <td>
                            {student.id}
                        </td>

                        <td>
                            {student.email}
                        </td>

                        <td>
                            <button
                            className="delete-btn"
                            onClick={() =>
                                handleRemove(
                                courseId,
                                student.id
                                )
                            }
                            >
                            Hapus
                            </button>
                        </td>
                        </tr>
                    )
                    )}

                </tbody>
                </table>
          )}

        </div>
      </div>
    </div>
  );
}