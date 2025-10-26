import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AppliedCourses() {
  const [userCourses, setUserCourses] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch("http://localhost:5000/user-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user courses");

        const data = await res.json();
        setUserCourses(data);
      } catch (err) {
        console.error("Error fetching user courses:", err);
      }
    };

    fetchUserCourses();
  }, [getAccessTokenSilently]);

  return (
    <div>
      <h1>My Applied Courses</h1>
      {userCourses.length === 0 ? (
        <p>You haven’t applied to any courses yet.</p>
      ) : (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Teacher</th>
                </tr>
            </thead>
            <tbody>
                {userCourses.map((course) => (
                    <tr key={course.id}>
                        <td>{course.course_name}</td>
                        <td>Teacher: {course.teacher_name}</td>
                    </tr>
                ))}
          </tbody>
        </table>
      )}
    </div>
  );
}