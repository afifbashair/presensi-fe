import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔥 LOGIN
  const handleLogin = async () => {
  try {
    setError("");

    // clear session lama
    localStorage.clear();

    const res = await API.post("/auth/login", {
      email,
      password,
    });

    // simpan token
    localStorage.setItem(
      "token",
      res.data.token
    );

    // simpan user
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    const isAdmin =
      res.data.user.roles.includes("admin") ||
      res.data.user.roles.includes("teacher");

    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }

  } catch (err) {
    console.log(err);

    setError(
      err.response?.data?.message ||
      "Login gagal"
    );
  }
};

  // 🔥 AUTO REDIRECT JIKA SUDAH LOGIN
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      const isAdmin =
        user.roles?.includes("admin") ||
        user.roles?.includes("teacher");

      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="login-title">
          E-Learning LMS
        </h1>

        <p className="login-subtitle">
          Sistem Presensi Geofencing
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

        <div className="login-footer">
          © 2026 E-Learning System
        </div>
      </div>
    </div>
  );
}