import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function HandleEnrollments() {
  const [courses, setCourses] = useState([]);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch("http://localhost:5000/instructor-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch instructor courses");

        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching instructor courses:", err);
      }
    };

    fetchInstructorCourses();
  }, [getAccessTokenSilently]);

  return (
    <div>
      <h1>Handle Enrollments</h1>
      {courses.length === 0 ? (
        <p>You haven’t created any courses yet.</p>
      ) : (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Credits</th>
                    <th>Prerequisites</th>
                    <th>Max. Students</th>
                </tr>
            </thead>
            <tbody>
                {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.name}</td>
              <td>{course.credits}</td>
              <td>
                {" "}
                {Array.isArray(course.prereqs) && course.prereqs.length > 0
                  ? course.prereqs.join(", ")
                  : course.prereqs && typeof course.prereqs === "string" && course.prereqs !== ""
                ? course.prereqs
                : "None"}
              </td>
              <td>{course.students_allowed}</td>
            </tr>
          ))}
            </tbody>
        </table>
      )}
    </div>
  );
}