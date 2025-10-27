import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";

export default function Course(props) {
    const { courseId } = useParams();
    const { getAccessTokenSilently } = useAuth0();
    const [course, setCourse] = useState(null);
    const [completedCourses, setCompletedCourses] = useState([]);
    const [canApply, setCanApply] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [courses, setCourses] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${apiUrl}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch event");
        const courseData = await res.json();
        setCourse(courseData);
        setEditData(courseData);

        // Fetch user's enrolled courses
        const enrolledRes = await fetch(`${apiUrl}/user-courses?status=enrolled`, {
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

      // Fetches all courses for prereq dropdown
      const getCourses = async () => {
            try {
              const token = await getAccessTokenSilently();
              const response = await fetch(`${apiUrl}/courses`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (!response.ok) {
                throw new Error("Failed to fetch courses");
              }
              const data = await response.json();
              setCourses(data);
            } catch (err) {
              console.error("Error fetching courses:", err);
            }
          };
      
          getCourses();
    };

    fetchCourse();
  }, [courseId, getAccessTokenSilently]);

   // Handle applying
  const handleApply = async () => {
    if (!course) return;

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${apiUrl}/user-courses`, {
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

  // Handles form field changes when editing
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Handles editing form updates
   const handleUpdate = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`${apiUrl}/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Course updated successfully!");
        setCourse(data);
        setIsEditing(false);
      } else {
        alert(data.error || "Error updating course");
      }
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Server error.");
    }
  };

  if (!course) return <p>Loading...</p>;

    return (
        <div>
            {/* EDIT MODE */}
            {isEditing ? (
              <div>
                <div>
                  <label>Course Name: </label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label>Credits: </label>
                  <input
                    type="number"
                    name="credits"
                    value={editData.credits}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <label>Prerequisites: </label>
                  <select name="prereqs" value={editData.prereqs} onChange={handleEditChange}>
                    <option>None</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Max Students Allowed: </label>
                  <input
                    type="number"
                    name="students_allowed"
                    value={editData.students_allowed}
                    onChange={handleEditChange}
                  />
                </div>
                <button onClick={handleUpdate}>Update</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            ) : (
              // VIEW MODE
              <div>
                <h2>{course.name}</h2>
                <p>Credits: {course.credits}</p>
                <p>Prerequisites: {course.prereqs}</p>
                <p>Max. Number of Students Allowed: {course.students_allowed}</p>
                <p>Students Enrolled: {course.enrolled_students}</p>
            {props.profile?.role === "Instructor" && (<button onClick={() => setIsEditing(true)}>Edit Course</button>)}
            <button onClick={handleApply} disabled={!canApply || course.enrolled_students >= course.students_allowed}>Apply</button>
            </div>
            )}
        </div>
  )
}