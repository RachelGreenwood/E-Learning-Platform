import { useEffect, useState } from "react";

export default function SeeUsers() {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = users.filter((user) => {
    const matchesRole =
      selectedRole === "All" ? true : user.role === selectedRole;
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());;
    return matchesRole && matchesSearch;
  });

  return (
    <div>
      <h1>See All Users</h1>
      <p>Search/Filter Users</p>
      <div>
        <div>
          <label>Search by Username or Email: </label>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div>
          <label>Instructor or Student: </label>
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="All">All</option>
            <option value="Student">Student</option>
            <option value="Instructor">Instructor</option>
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
          {filteredUsers.map((user) => (
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