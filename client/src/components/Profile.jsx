import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [discipline, setDiscipline] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.profile);
        setUsername(data.profile.username);
        setEmail(data.profile.email);
        setDiscipline(
          Array.isArray(data.profile.discipline)
            ? data.profile.discipline
            : data.profile.discipline.split(",")
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

const updateProfile = async (updatedProfile, token) => {
  try {
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProfile),
    });

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    const data = await res.json();
    console.log("Profile updated:", data);
  } catch (error) {
    console.error(error);
  }
};

  const handleDisciplineChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setDiscipline(values);
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Your Profile</h2>

      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>

      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label>
        Choose your discipline(s):
        <select multiple value={discipline} onChange={handleDisciplineChange}>
          <option value="MMA">MMA</option>
          <option value="Taekwondo">Taekwondo</option>
          <option value="Aikido">Aikido</option>
          <option value="Muay Thai">Muay Thai</option>
        </select>
      </label>

      <button type="submit">Save Changes</button>
    </form>
  );
}
