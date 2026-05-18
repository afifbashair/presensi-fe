import { useEffect, useState } from "react";

import API from "../services/api";

import "../styles/admin.css";

export default function ManageCourses() {

  const [courses, setCourses] =
    useState([]);

  const [form, setForm] =
    useState({
      name: "",
      description: "",
      thumbnail: "",
      teacher_name: "",
    });

  const [editId, setEditId] =
    useState(null);

  // FETCH
  const fetchCourses =
    async () => {
      const res =
        await API.get("/courses");

      setCourses(res.data);
    };

  useEffect(() => {
    fetchCourses();
  }, []);

  // SUBMIT
  const handleSubmit =
    async () => {
      try {
        if (editId) {
          await API.put(
            `/courses/${editId}`,
            form
          );

          alert(
            "Course berhasil diupdate"
          );

        } else {
          await API.post(
            "/courses",
            form
          );

          alert(
            "Course berhasil dibuat"
          );
        }

        setForm({
          name: "",
          description: "",
          thumbnail: "",
          teacher_name: "",
        });

        setEditId(null);

        fetchCourses();

      } catch (err) {
        alert(
          err.response?.data?.message
        );
      }
    };

  // EDIT
  const handleEdit = (c) => {
    setForm(c);

    setEditId(c.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Hapus course?"
        );

      if (!confirmDelete) return;

      await API.delete(
        `/courses/${id}`
      );

      fetchCourses();
    };

  return (
    <div className="admin-container">
      <h2>Kelola Course</h2>

      {/* FORM */}
      <div className="admin-form">

        <input
          placeholder="Nama Course"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Nama Dosen"
          value={form.teacher_name}
          onChange={(e) =>
            setForm({
              ...form,
              teacher_name:
                e.target.value,
            })
          }
        />

        <input
          placeholder="Thumbnail URL"
          value={form.thumbnail}
          onChange={(e) =>
            setForm({
              ...form,
              thumbnail:
                e.target.value,
            })
          }
        />

        <textarea
          placeholder="Deskripsi"
          rows="4"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <button onClick={handleSubmit}>
          {editId
            ? "Update Course"
            : "Tambah Course"}
        </button>
      </div>

      {/* TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Thumbnail</th>
            <th>Course</th>
            <th>Dosen</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>

              <td>
                <img
                  src={
                    c.thumbnail ||
                    "https://picsum.photos/80"
                  }
                  alt=""
                  width="80"
                />
              </td>

              <td>{c.name}</td>

              <td>
                {c.teacher_name}
              </td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(c)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(c.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}