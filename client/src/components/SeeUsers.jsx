import { useEffect, useState } from "react";

export default function SeeUsers() {
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
      <h1>See All Users</h1>
      <p>Search/Filter Users</p>
      <div>
        <div>
          <label>Instructor or Student: </label>
          <select>
            <option value="instructor">Instructor</option>
            <option value="student">Student</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Discipline</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.discipline}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}