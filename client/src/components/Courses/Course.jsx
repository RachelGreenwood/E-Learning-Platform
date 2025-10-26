import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";

export default function Course() {
    const { courseId } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`http://localhost:5000/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
  }, [courseId, getAccessTokenSilently]);

   // Handle applying
  const handleApply = async () => {
    if (!course) return;

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("http://localhost:5000/user-courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: course.id }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Successfully applied for ${course.name}!`);
      } else {
        alert(data.error || "Error applying to course");
      }
    } catch (err) {
      console.error("Error applying:", err);
      alert("Server error. Please try again later.");
    }
  };

  if (!course) return <p>Loading...</p>;

    return (
        <div>
            <h1>{course.name}</h1>
            <p>Credits: {course.credits}</p>
            <p>Prerequisites: {course.prereqs}</p>
            <p>Max. Number of Students Allowed: {course.students_allowed}</p>
            <button onClick={handleApply}>Apply</button>
        </div>
    )
}