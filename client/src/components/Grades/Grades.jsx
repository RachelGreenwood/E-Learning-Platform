import { useEffect, useState } from "react";

export default function Grades() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchUsers() {
          try {
            const res = await fetch("http://localhost:5000/api/profiles");
            const data = await res.json();
            setUsers(data);
          } catch (err) {
            console.error("Error fetching users:", err);
          }
        }
    
        fetchUsers();
      }, []);

    return (
        <div>
            <h1>Manage Grades</h1>
            <select>
                {users.map((user) => (
                    <option key={user.id}>{user.username}</option>
                ))}
            </select>
        </div>
    )
}