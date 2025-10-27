import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentDetails from "./StudentDetails";
import { useAuth0 } from "@auth0/auth0-react";

export default function Grades(props) {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
      const fetchCourse = async () => {
        if (!selectedStudent) return;
          try {
            // Fetch user's enrolled courses
            const token = await getAccessTokenSilently();
            const enrolledRes = await fetch(`${apiUrl}/student-courses?user_id=${selectedStudent.auth0_id}&status=enrolled`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!enrolledRes.ok) throw new Error("Failed to fetch enrolled courses");
            const enrolledData = await enrolledRes.json();
            console.log("enrolledData:", enrolledData);
            setEnrolledCourses(enrolledData);
          } catch (err) {
            console.error(err);
          }
        };

        fetchCourse();
      }, [selectedStudent, getAccessTokenSilently, apiUrl]);

    useEffect(() => {
        async function fetchUsers() {
          try {
            const res = await fetch(`${apiUrl}/api/profiles`);
            const data = await res.json();
            setUsers(data);
          } catch (err) {
            console.error("Error fetching users:", err);
          }
        }
    
        fetchUsers();
      }, []);

      const students = users.filter(user => user.role === "Student")
console.log(students); // do students[i].sub match the DB user_id?


      const handleSelectChange = (e) => {
        const student = students.find(
          (s) => s.auth0_id === e.target.value
        );
        setSelectedStudent(student);
      };

    return (
        <div>
            <h1>Manage Grades</h1>
            {props.profile?.role === "Instructor" && (
                <select onChange={handleSelectChange}>
                  <option value="">Select a Student</option>
                {students.map((user) => (
                    <option key={user.id} value={user.auth0_id}>{user.username}</option>
                ))}
            </select>
            )}
            <StudentDetails student={selectedStudent} enrolledCourses={enrolledCourses} />
        </div>
    )
}