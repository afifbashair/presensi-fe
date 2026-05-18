import { useEffect, useState } from "react";

import API from "../services/api";

import "../styles/admin.css";

export default function ManageUsers() {

  const [users, setUsers] =
    useState([]);

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "student",
    });

  // FETCH
  const fetchUsers = async () => {
    try {
      const res =
        await API.get("/users");

      setUsers(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // CREATE
  const handleSubmit = async () => {
    try {
      await API.post(
        "/users",
        form
      );

      alert(
        "User berhasil dibuat"
      );

      setForm({
        name: "",
        email: "",
        password: "",
        role: "student",
      });

      fetchUsers();

    } catch (err) {
      alert(
        err.response?.data?.message
      );
    }
  };

  // DELETE
  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Hapus user ini?"
      );

    if (!confirmDelete) return;

    await API.delete(
      `/users/${id}`
    );

    fetchUsers();
  };

  return (
    <div className="admin-container">
      <h2>Kelola User</h2>

      {/* FORM */}
      <div className="admin-form">

        <input
          placeholder="Nama"
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
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value,
            })
          }
        />

        {/* ROLE */}
        <select
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role:
                e.target.value,
            })
          }
        >
          <option value="student">
            Student
          </option>

          <option value="teacher">
            Teacher
          </option>

          <option value="admin">
            Admin
          </option>
        </select>

        <button onClick={handleSubmit}>
          Tambah User
        </button>
      </div>

      {/* TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>

              <td>{u.name}</td>

              <td>{u.email}</td>

              <td>
                {u.roles.join(", ")}
              </td>

              <td>
                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(
                      u.id
                    )
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