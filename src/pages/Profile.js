import { useEffect, useState } from "react";

import API from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/profile.css";

export default function Profile() {
  const [email, setEmail] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    bio: "",
    avatar: "",
  });

  // FETCH
  useEffect(() => {
    API.get("/profile/me").then((res) => {
      setEmail(res.data.email);

      setForm(res.data.profile);
    });
  }, []);

  // SAVE
  const handleSave = async () => {
    try {
      await API.put("/profile/me", form);

      alert("Profile berhasil disimpan");

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="profile-page">
          <div className="profile-card">

            {/* AVATAR */}
            <div className="avatar-section">
              <img
                src={
                  form.avatar ||
                  "https://i.pravatar.cc/150"
                }
                alt="avatar"
              />

              <input
                placeholder="Avatar URL"
                value={form.avatar}
                onChange={(e) =>
                  setForm({
                    ...form,
                    avatar: e.target.value,
                  })
                }
              />
            </div>

            {/* INFO */}
            <div className="profile-info">

              <h2>My Profile</h2>

              <label>Email</label>

              <input
                value={email}
                disabled
              />

              <label>Nama Lengkap</label>

              <input
                value={form.full_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    full_name:
                      e.target.value,
                  })
                }
              />

              <label>No HP</label>

              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone:
                      e.target.value,
                  })
                }
              />

              <label>Alamat</label>

              <input
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address:
                      e.target.value,
                  })
                }
              />

              <label>Bio</label>

              <textarea
                rows="4"
                value={form.bio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bio:
                      e.target.value,
                  })
                }
              />

              <button onClick={handleSave}>
                Simpan Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}