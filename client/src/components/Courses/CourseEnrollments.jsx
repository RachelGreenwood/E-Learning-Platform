import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AppliedToEnrolled from "./AppliedToEnrolled";

export default function CourseEnrollments() {
    const location = useLocation();
    const course = location.state?.course;
    const { courseId } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [students, setStudents] = useState([]);

    useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(
          `http://localhost:5000/course-students/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, [courseId, getAccessTokenSilently]);

    return (
        <div>
            <h1>{course?.name}</h1>
            <h2>Applied Students</h2>
            {students.length === 0? (
                <p>No students have applied yet</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td><input type="checkbox" /></td>
                                <td>{student.username}</td>
                                <td>{student.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
            }
            <button>Enroll Student(s)</button>
            <AppliedToEnrolled />
        </div>
    )
}