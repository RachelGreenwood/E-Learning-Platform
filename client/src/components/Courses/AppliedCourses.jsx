export default function AppliedCourses({ applied }) {

  return (
    <div>
      <h1>My Applied Courses</h1>
      {applied.length === 0 ? (
        <p>You haven’t applied to any courses yet.</p>
      ) : (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Teacher</th>
                </tr>
            </thead>
            <tbody>
                {applied.map((course) => (
                    <tr key={course.id}>
                        <td>{course.course_name}</td>
                        <td>Teacher: {course.teacher_name}</td>
                    </tr>
                ))}
          </tbody>
        </table>
      )}
    </div>
  );
}