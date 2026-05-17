import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/courses").then((res) => setCourses(res.data));
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Navbar />

        <div className="content">
          <h2>My Courses</h2>

          <div className="course-grid">
            {courses.map((c) => (
              <div
                key={c.id}
                className="course-card"
                onClick={() => navigate(`/course/${c.id}`)}
              >
                <div className="course-header"></div>

                <div className="course-body">
                  <p>S1 Informatika</p>
                  <h4>{c.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}