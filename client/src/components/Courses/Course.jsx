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

  if (!course) return <p>Loading...</p>;

    return (
        <div>
            <h1>Course</h1>
        </div>
    )
}