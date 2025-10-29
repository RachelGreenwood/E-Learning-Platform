import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import Course from "../Courses/Course.jsx";

export default function MyCourses() {
    const [courses, setCourses] = useState([]);
    const { getAccessTokenSilently, user } = useAuth0();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
      const getCourses = async () => {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${apiUrl}/courses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch courses");
          }
          const data = await response.json();
          setCourses(data);
        } catch (err) {
          console.error("Error fetching courses:", err);
        }
      };
  
      getCourses();
    }, [getAccessTokenSilently]);

    // Allows instructor to delete a course
    const handleDelete = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${apiUrl}/courses/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete course");
      alert("Course deleted successfully!")

      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course");
    }
  };

    const instructorsCourses = courses.filter((course) => course.created_by === user.sub)

    const handleSelectChange = (e) => {
        setSelectedCourse(e.target.value);
      };

    return (
        <div>
            <h1>My Courses</h1>
            <select onChange={handleSelectChange}>
                  <option value="">Select a Course</option>
                {instructorsCourses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                ))}
            </select>
            <Course courseId={selectedCourse} />
            <button onClick={() => handleDelete(selectedCourse)}>Delete</button>
        </div>
    )
}