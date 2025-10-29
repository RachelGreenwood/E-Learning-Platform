import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

export default function StudentDetails({ student, enrolledCourses, userRole }) {
    const [gradesInput, setGradesInput] = useState(
        enrolledCourses.reduce((acc, course) => {
            acc[course.course_id] = { assignmentName: "", grade: "" };
            return acc;
        }, {})
    );
    const { getAccessTokenSilently } = useAuth0();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [grades, setGrades] = useState({});

    // Gets student's grades
    useEffect(() => {
  const fetchExistingGrades = async () => {
    if (!student) return;
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${apiUrl}/grades/${student.auth0_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch grades");
      const data = await res.json();

      const grouped = data.reduce((acc, grade) => {
        if (!acc[grade.course_id]) acc[grade.course_id] = [];
        acc[grade.course_id].push(grade);
        return acc;
      }, {});
      setGrades(grouped);
    } catch (err) {
      console.error("Error fetching grades:", err);
    }
  };

  fetchExistingGrades();
}, [student, apiUrl, getAccessTokenSilently]);

    // Translates numerical grades to points
    const gradeToPoints = (grade) => {
        if (typeof grade === "number") {
            if (grade >= 90) return 4.0;
            if (grade >= 80) return 3.0;
            if (grade >= 70) return 2.0;
            if (grade >= 60) return 1.0;
            return 0.0;
        }

        // Translates letter grades to points
        const g = grade.toUpperCase();
        switch (g) {
            case "A": return 4.0;
            case "B": return 3.0;
            case "C": return 2.0;
            case "D": return 1.0;
            case "F": return 0.0;
            default: return null;
        }
    };

    // Calculates GPA from current grades
    const calculateGPA = () => {
        const allGrades = Object.values(grades).flat();
        const validPoints = allGrades
            .map(g => gradeToPoints(g.grade))
            .filter(p => p !== null);

        if (validPoints.length === 0) return "N/A";
        const gpa = validPoints.reduce((a, b) => a + b, 0) / validPoints.length;
        return gpa.toFixed(2);
    };

    // Color-codes grades
    const getGradeColor = (grade) => {
        if (!grade) return "inherit";
        if (typeof grade === "number") {
            if (grade >= 90) return "green";
            if (grade >= 80) return "goldenrod";
            if (grade >= 70) return "orange";
            if (grade >= 60) return "red";
            return "darkred";
        }
        const g = grade.toUpperCase();
        switch (g) {
            case "A": return "green";
            case "B": return "goldenrod";
            case "C": return "orange";
            case "D": return "red";
            case "F": return "darkred";
            default: return "inherit";
        }
    };

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
            auth0_id: student.auth0_id,
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
            <p>GPA: {calculateGPA()}</p>
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
                                {g.assignment_name}: {" "}
                                <span style={{ color: getGradeColor(g.grade), fontWeight: "bold" }}>
                                    {g.grade}
                                </span>
                                {g.assigned_at}
                            </li>
                            ))}
                        </ul>
                    )}
                </div>
{/* Teacher can assign grades */}
                {userRole === "Instructor" && (
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
                )}
                </div>
            ))}
        </div>
    )
}