import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";

export default function Course() {
    const { courseId } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [course, setCourse] = useState(null);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [canApply, setCanApply] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`http://localhost:5000/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch event");
        const courseData = await res.json();
        setCourse(courseData);

        // Fetch user's enrolled courses
        const enrolledRes = await fetch("http://localhost:5000/user-courses?status=enrolled", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!enrolledRes.ok) throw new Error("Failed to fetch enrolled courses");
        const enrolledData = await enrolledRes.json();
        setCompletedCourses(enrolledData.map((c) => c.course_name))
        // Check prerequisites
        let prereqsArray = [];
        if (Array.isArray(courseData.prereqs)) {
          prereqsArray = courseData.prereqs;
        } else if (typeof courseData.prereqs === "string" && courseData.prereqs.trim() !== "") {
          prereqsArray = [courseData.prereqs];
        }
        const allPrereqsMet = prereqsArray.every((p) => enrolledData.some((c) => c.course_name === p));
        setCanApply(allPrereqsMet);
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
            <p>Students Enrolled: {course.enrolled_students}</p>
            <button onClick={handleApply} disabled={!canApply}>Apply</button>
        </div>
    )
}