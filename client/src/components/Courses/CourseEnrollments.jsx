import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function CourseEnrollments() {
    const location = useLocation();
    const course = location.state?.course;
    const { courseId } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [appliedStudents, setAppliedStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [appliedSearch, setAppliedSearch] = useState("");
    const [enrolledSearch, setEnrolledSearch] = useState("");

    useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(
          `${apiUrl}/course-students/${courseId}`,
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

// Removes students from course
const handleDelete = async () => {
    if (selectedStudents.length === 0) {
        alert("No students selected for deletion");
        return;
    }

    if (!window.confirm("Are you sure you want to delete the selected student(s)?")) {
        return;
    }

    try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${apiUrl}/course-students/${courseId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ studentIds: selectedStudents }),
        });

        if (!res.ok) throw new Error("Failed to delete students");

        setAppliedStudents((prev) => prev.filter((s) => !selectedStudents.includes(s.id)));
        setEnrolledStudents((prev) => prev.filter((s) => !selectedStudents.includes(s.id)));
        setSelectedStudents([]);
        alert("Selected students deleted successfully!");
    } catch (err) {
        console.error(err);
        alert("Error deleting students");
    }
};

const handleEnroll = async () => {
  try {
    const token = await getAccessTokenSilently();
    const res = await fetch(`${apiUrl}/course-students/${courseId}`, {
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

    // Search applied students
    const filteredApplied = appliedStudents.filter((s) =>
        s.username.toLowerCase().includes(appliedSearch.toLowerCase())
    );

    // Search enrolled students
    const filteredEnrolled = enrolledStudents.filter((s) =>
        s.username.toLowerCase().includes(enrolledSearch.toLowerCase())
    );

    return (
        <div>
            <h1>{course?.name}</h1>
            <h2>Applied Students</h2>
            <div>
              <label>Search Students: </label>
              <input
                type="text"
                value={appliedSearch}
                onChange={(e) => setAppliedSearch(e.target.value)}
              />
            </div>
            {filteredApplied.length === 0? (
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
                        {filteredApplied.map((student) => (
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
            <button onClick={handleDelete}>Delete Student(s)</button>
            <div>
                <h2>Enrolled Students</h2>
                <div>
                  <label>Search Students: </label>
                  <input
                    type="text"
                    value={enrolledSearch}
                    onChange={(e) => setEnrolledSearch(e.target.value)}
                  />
                </div>                
                {filteredEnrolled.length === 0 ? (
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
                        {filteredEnrolled.map((student) => (
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