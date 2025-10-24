import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function ProfileSetup() {
  const { user, getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
  const [role, setRole] = useState("Student");
  const [discipline, setDiscipline] = useState("MMA");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
    alert("User data not loaded yet. Please try again.");
    return;
  }
  
try {
    let token;
    try {
      token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE
      });
    } catch (e) {
      if (e.error === "consent_required" || e.error === "login_required") {
        token = await getAccessTokenWithPopup({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE
        });
      } else {
        throw e;
      }
    }

      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST", // or PATCH if you want
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            username: username,
            email: user.email,
            discipline: discipline,
            role: role,
        }),
      });

      if (!response.ok) throw new Error("Failed to save role");

      // After successful save, navigate to dashboard/home page
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving role. Please try again.");
    }
  };

  return (
     <form onSubmit={handleSubmit}>
        <label>
        Enter your username:
        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
      </label>
      <label>
        Choose your role:
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
        </select>
      </label>
      <label>
        Choose your discipline(s):
        <select value={discipline} onChange={(e) => setDiscipline(e.target.value)}>
          <option value="MMA">MMA</option>
          <option value="Taekwondo">Taekwondo</option>
          <option value="Aikido">Aikido</option>
          <option value="Muay Thai">Muay Thai</option>
        </select>
      </label>
      <button type="submit">Continue</button>
    </form>
  );
}