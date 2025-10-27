import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function MyCourses() {
    const [courses, setCourses] = useState([]);
    const { getAccessTokenSilently, user } = useAuth0();
    const apiUrl = import.meta.env.VITE_API_URL;

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

      setCourses((prev) => prev.filter((course) => course.id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course");
    }
  };

    const instructorsCourses = courses.filter((course) => course.created_by === user.sub)

    return (
        <div>
            <h1>My Courses</h1>
            {instructorsCourses.map((course) => (
                <div>
                  <Link to={`/course/${course.id}`} key={course.id}>{course.name}</Link>
                <button onClick={() => handleDelete(course.id)}>Delete</button>
                </div>
            ))}
        </div>
    )
}