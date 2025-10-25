import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function CreateCourse() {
    const { getAccessTokenSilently } = useAuth0();

    const [formData, setFormData] = useState({
        name: "",
        credits: "",
        prereqs: "",
        students_allowed: "",
    });

    // Updates form with user's input
    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //   Handles submit button
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sends event data to BE
     try {
        const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:5000/courses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Course created successfully!");
        console.log("Course:", data);
      } else {
        alert("Error creating event.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  };

    return (
        <div>
            <h1>Create Course</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Course Name: </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Credits: </label>
                    <input type="number" name="credits" value={formData.credits} onChange={handleChange} />
                </div>
                <div>
                    <label>Prerequisites: </label>
                    <select name="prereqs" value={formData.prereqs} onChange={handleChange}>
                        <option>None</option>
                    </select>
                </div>
                <div>
                    <label>Maximum Number of Students Allowed: </label>
                    <input type="number" name="students_allowed" value={formData.students_allowed} onChange={handleChange} />
                </div>
                <button type="submit">Create Course</button>
            </form>
        </div>
    )
}