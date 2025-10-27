import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

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

    const instructorsCourses = courses.filter((course) => course.created_by === user.sub)

    return (
        <div>
            <h1>My Courses</h1>
            {instructorsCourses.map((course) => (
                <p key={course.id}>{course.name}</p>
            ))}
        </div>
    )
}