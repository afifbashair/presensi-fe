import axios from "axios";

const API = axios.create({
  baseURL: "https://presensi-be-276882742884.us-central1.run.app/api",
});

// 🔐 AUTO INSERT TOKEN
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🚨 AUTO LOGOUT JIKA TOKEN INVALID
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);



export default API;