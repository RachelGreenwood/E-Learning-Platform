export default function StudentDetails({ student }) {
      console.log("StudentDetails rendered with:", student);

    if (!student) {
    return <p>No student selected</p>;
  }

    return (
        <div>
            <h1>Student Details</h1>
            <p>{student.username}</p>
        </div>
    )
}