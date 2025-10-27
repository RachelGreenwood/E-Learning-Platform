import AppliedCourses from "./AppliedCourses";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function EnrolledCourses() {
    const { getAccessTokenSilently } = useAuth0();
    const [applied, setApplied] = useState([]);
    const [enrolled, setEnrolled] = useState([]);

    useEffect(() => {
        const fetchUserCourses = async () => {
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch("http://localhost:5000/user-courses", {
            headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch user courses");

            const data = await res.json();
            setApplied(data.filter((s) => s.status === "applied"));
            setEnrolled(data.filter((s) => s.status === "enrolled"));
        } catch (err) {
            console.error("Error fetching user courses:", err);
        }
        };

        fetchUserCourses();
    }, [getAccessTokenSilently]);

    return (
        <div>
            <h1>My Enrolled Courses</h1>
            {enrolled.length === 0 ? (
        <p>You haven’t enrolled in any courses yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {enrolled.map((course) => (
                <tr key={course.id}>
                    <td>{course.course_name}</td>
                    <td>Teacher: {course.teacher_name}</td>
                </tr>
            ))}
          </tbody>
        </table>
      )}
            <AppliedCourses applied={applied} />
        </div>
    )
}