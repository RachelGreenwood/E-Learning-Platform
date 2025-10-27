import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Grades(props) {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

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

    return (
        <div>
            <h1>Manage Grades</h1>
            {props.profile?.role === "Instructor" && (
                <select>
                {students.map((user) => (
                    <option key={user.id}>{user.username}</option>
                ))}
            </select>
            )}
        </div>
    )
}