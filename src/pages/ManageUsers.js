import { useEffect, useState } from "react";
import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/manageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 ASSIGN ROLE
  const handleRoleChange = async (userId, role) => {
    try {
      await API.post(`/users/${userId}/assign-role`, {
        role_name: role,
      });

      alert("Role berhasil diubah");

      fetchUsers();

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="manage-users">
          <h1>Kelola User</h1>

          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Role</th>
                <th>Ubah Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>

                  <td>{u.email}</td>

                  <td>
                    {u.roles?.map((r) => r.name).join(", ")}
                  </td>

                  <td>
                    <select
                      onChange={(e) =>
                        handleRoleChange(
                          u.id,
                          e.target.value
                        )
                      }
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Pilih Role
                      </option>

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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}