import AppliedCourses from "./AppliedCourses";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function EnrolledCourses() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const { getAccessTokenSilently } = useAuth0();

     useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch("http://localhost:5000/user-courses?status=enrolled", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch enrolled courses");

        const data = await res.json();
        setEnrolledCourses(data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    };

    fetchEnrolledCourses();
  }, [getAccessTokenSilently]);

    return (
        <div>
            <h1>My Enrolled Courses</h1>
            {enrolledCourses.length === 0 ? (
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
            {enrolledCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.course_name}</td>
                <td>Teacher: {course.teacher_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
            <AppliedCourses />
        </div>
    )
}