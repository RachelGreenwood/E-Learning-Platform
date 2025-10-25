import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function CoursesList() {
    const [courses, setCourses] = useState([]);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
      const getCourses = async () => {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch("http://localhost:5000/courses", {
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

    return (
        <div>
            <h1>See All Courses</h1>
            {courses.length === 0 ? ( <p>No courses found. Check back later!</p>) : (
                courses.map((course) => <Link to={`/course/${course.id}`} key={course.id}>{course.name}</Link>)
            )}
        </div>
    )
}