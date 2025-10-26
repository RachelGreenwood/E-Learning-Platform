import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AppliedToEnrolled from "./AppliedToEnrolled";

export default function CourseEnrollments() {
    const location = useLocation();
    const course = location.state?.course;
    const { courseId } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [appliedStudents, setAppliedStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

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
        setAppliedStudents(data.filter((s) => s.status === "applied"));
        setEnrolledStudents(data.filter((s) => s.status === "enrolled"));
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, [courseId, getAccessTokenSilently]);


const handleCheckboxChange = (studentId) => {
  setSelectedStudents((prev) =>
    prev.includes(studentId)
      ? prev.filter((id) => id !== studentId)
      : [...prev, studentId]
  );
};

const handleEnroll = async () => {
  try {
    const token = await getAccessTokenSilently();
    const res = await fetch(`http://localhost:5000/course-students/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ studentIds: selectedStudents }),
    });
    console.log("Enrolling students:", selectedStudents, "for courseId:", courseId);


    if (!res.ok) throw new Error("Failed to enroll students");

    const newlyEnrolled = appliedStudents.filter((s) => selectedStudents.includes(s.id));
    setAppliedStudents((prev) => prev.filter((s) => !selectedStudents.includes(s.id)));
    alert("Students successfully enrolled!");
    setEnrolledStudents((prev) => [...prev, ...newlyEnrolled])
    setSelectedStudents([]);
    // Re-fetch students to update the UI
  } catch (err) {
    console.error(err);
    alert("Error enrolling students");
  }
};

    return (
        <div>
            <h1>{course?.name}</h1>
            <h2>Applied Students</h2>
            {appliedStudents.length === 0? (
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
                        {appliedStudents.map((student) => (
                            <tr key={student.id}>
                                <td><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => handleCheckboxChange(student.id)} /></td>
                                <td>{student.username}</td>
                                <td>{student.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
            }
            <button onClick={handleEnroll}>Enroll Student(s)</button>
            <div>
                <AppliedToEnrolled />
                {enrolledStudents.length === 0 ? (
                    <p>No students have been enrolled yet</p>
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
                        {enrolledStudents.map((student) => (
                        <tr key={student.id}>
                            <td>
                            <input
                                type="checkbox"
                                checked={selectedStudents.includes(student.id)}
                                onChange={() => handleCheckboxChange(student.id)}
                            />
                            </td>
                            <td>{student.username}</td>
                            <td>{student.email}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}