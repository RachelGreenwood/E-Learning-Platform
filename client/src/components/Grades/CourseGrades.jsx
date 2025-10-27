export default function CourseGrades({ enrolledCourses }) {
    return (
        <div>
            <h1>Course Grades</h1>
            {enrolledCourses.map((course) => (
                <div key={course.course_id} style={{ marginBottom: "2rem" }}>
                <h4>{course.course_name}</h4>
                <p>Teacher: {course.teacher_name}</p>

                <div>
                <label>Assignment Name:</label>
                <input type="text" placeholder="Assignment Title" />
                </div>

                <div>
                <label>Grade:</label>
                <input type="text" placeholder="Grade" />
                </div>

                <button>Submit Grade</button>
            </div>
            ))}
        </div>
    )
}