export default function StudentDetails({ student }) {
      console.log("StudentDetails rendered with:", student);

    if (!student) {
    return <p>No student selected</p>;
  }

    return (
        <div>
            <h2>{student.username}</h2>
            <p>Email: {student.email}</p>
            <p>Discipline: {student.discipline}</p>
        </div>
    )
}