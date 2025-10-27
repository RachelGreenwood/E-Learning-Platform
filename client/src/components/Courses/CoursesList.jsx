import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function CoursesList() {
    const [courses, setCourses] = useState([]);
    const { getAccessTokenSilently } = useAuth0();
    const [searchTerm, setSearchTerm] = useState("");
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

    const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());;
    return matchesSearch;
  });

    return (
        <div>
            <h1>See All Courses</h1>
            <div>
              <label>Search by Course Name: </label>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {filteredCourses.length === 0 ? ( <p>No courses found. Check back later!</p>) : (
                filteredCourses.map((course) => <Link to={`/course/${course.id}`} key={course.id}>{course.name}</Link>)
            )}
        </div>
    )
}