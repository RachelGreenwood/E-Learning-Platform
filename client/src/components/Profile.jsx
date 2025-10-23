import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { getAccessTokenSilently } = useAuth0();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    discipline: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

//   Fetch user profile
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

        // Handle discipline field (convert string → array)
        const parsedDisciplines = Array.isArray(data.profile.discipline)
          ? data.profile.discipline
          : data.profile.discipline.split(",");

        setFormData({
          email: data.profile.email || "",
          username: data.profile.username || "",
          discipline: parsedDisciplines,
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [getAccessTokenSilently]);

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Convert array → comma-separated string
        body: JSON.stringify({
          ...formData,
          discipline: formData.discipline.join(","),
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      setMessage("Profile updated successfully!");
      console.log("Updated profile:", updated);
    } catch (error) {
      console.error(error);
      setMessage("Error updating profile.");
    }
  };

  const handleDisciplineChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, discipline: values });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Your Profile</h2>

      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Choose your discipline(s):
        <select
          multiple
          value={formData.discipline}
          onChange={handleDisciplineChange}
        >
          <option value="MMA">MMA</option>
          <option value="Taekwondo">Taekwondo</option>
          <option value="Aikido">Aikido</option>
          <option value="Muay Thai">Muay Thai</option>
        </select>
      </label>

      <button type="submit">Save Changes</button>

      {message && <p>{message}</p>}
    </form>
  );
}
