import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import CourseGrades from "./CourseGrades";

export default function StudentDetails({ student, enrolledCourses }) {

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

                {/* Grade input inline */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                    <input type="text" placeholder="Assignment Title" />
                    <input type="text" placeholder="Grade" />
                    <button>Submit Grade</button>
                </div>
                </div>
            ))}
        </div>
    )
}