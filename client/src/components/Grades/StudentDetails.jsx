import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export default function StudentDetails({ student, enrolledCourses }) {
    const [gradesInput, setGradesInput] = useState(
        enrolledCourses.reduce((acc, course) => {
            acc[course.course_id] = { assignmentName: "", grade: "" };
            return acc;
        }, {})
    );
    const { getAccessTokenSilently } = useAuth0();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [grades, setGrades] = useState({});

    const handleSubmitGrade = async (courseId) => {
    const { assignmentName, grade } = gradesInput[courseId] || {};
    if (!assignmentName || !grade) return alert("Fill in both fields");

    try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${apiUrl}/grades`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            courseId,
            studentId: student.auth0_id,
            assignmentName,
            grade,
        }),
        });

        if (!res.ok) throw new Error("Failed to submit grade");
        const newGrade = await res.json();

        setGrades((prev) => ({
            ...prev,
            [courseId]: [...(prev[courseId] || []), newGrade],
        }));

        // Clear the input fields
        setGradesInput((prev) => ({
            ...prev,
            [courseId]: { assignmentName: "", grade: "" },
        }));

        alert("Grade submitted!");
        // Optionally, update UI to show the grade immediately
    } catch (err) {
        console.error(err);
        alert("Error submitting grade");
    }
    };


    if (!student) {
    return <p>No student selected</p>;
  }

    return (
       <div>
            <h2>{student.username}</h2>
            <p>Email: {student.email}</p>
            <p>Discipline: {student.discipline}</p>
            <h3>Enrolled Courses</h3>

            {enrolledCourses.map((course) => (
                <div key={course.course_id} style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <span><strong>{course.course_name}</strong></span>
                    <span>Teacher: {course.teacher_name}</span>
                    <span>
                    Prerequisites: {Array.isArray(course.prerequisites) && course.prerequisites.length > 0
                        ? course.prerequisites.join(", ")
                        : "None"}
                    </span>
                </div>
                <div>
                    {grades[course.course_id]?.length > 0 && (
                        <ul style={{ marginTop: "0.5rem" }}>
                            {grades[course.course_id].map((g, idx) => (
                            <li key={idx}>
                                {g.assignment_name}: {g.grade}
                            </li>
                            ))}
                        </ul>
                    )}
                </div>
{/* Teacher can assign grades */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                    <input type="text" placeholder="Assignment" value={gradesInput[course.course_id]?.assignmentName || ""}
                                onChange={(e) =>
                                    setGradesInput((prev) => ({
                                        ...prev,
                                        [course.course_id]: {
                                            ...prev[course.course_id],
                                            assignmentName: e.target.value,
                                        },
                                    }))
                                }
                            />
                    <input
                        type="text"
                        placeholder="Grade"
                        value={gradesInput[course.course_id]?.grade || ""}
                        onChange={(e) =>
                            setGradesInput((prev) => ({
                            ...prev,
                            [course.course_id]: {
                                ...prev[course.course_id],
                                grade: e.target.value,
                            },
                            }))
                        }
                    />
                    <button onClick={() => handleSubmitGrade(course.course_id)}>Submit Grade</button>
                </div>
                </div>
            ))}
        </div>
    )
}