import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

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
            <table>
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Teacher</th>
                        <th>Prerequisites</th>
                    </tr>
                </thead>
                <tbody>
                    {enrolledCourses.map((course) => (
                    <tr key={course.course_id}>
                        <td>{course.course_name}</td>
                        <td>{course.teacher_name}</td>
                        <td>
                            {Array.isArray(course.prerequisites) && course.prerequisites.length > 0
                                ? course.prerequisites.join(", ")
                                : "None"}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}