import { useNavigate } from "react-router-dom";
import "../styles/course.css";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  return (
    <div
      className="course-card"
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <div className="course-header"></div>

      <div className="course-body">
        <p>S1 Informatika</p>
        <h4>{course.name}</h4>
      </div>
    </div>
  );
}