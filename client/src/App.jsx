import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import ProfileSetup from "./components/Profile/ProfileSetup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile/Profile.jsx";
import NavBar from "./components/NavBar.jsx";
import SeeUsers from "./components/UserSearch/SeeUsers.jsx";
import CreateCourse from "./components/Courses/CreateCourse.jsx";
import CoursesList from "./components/Courses/CoursesList.jsx";
import Course from "./components/Courses/Course.jsx";
import EnrolledCourses from "./components/Courses/EnrolledCourses.jsx";

function App() {

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`http://localhost:5000/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <div>
      <NavBar profile={profile} />
      <Routes>
        <Route path="/" element={<HomePage />} />
      <Route path="/profile-setup" element={<ProfileSetup setProfile={setProfile} />} />
      <Route path="/dashboard" element={<Dashboard />} />  
      <Route path="/profile" element={<Profile />} /> 
      <Route path="/user-search" element={<SeeUsers />} />
      <Route path="/create-course" element={<CreateCourse />} />
      <Route path="/course-list" element={<CoursesList />} />
      <Route path="/course/:courseId" element={<Course />} />
      <Route path="/enrolled-courses" element={<EnrolledCourses />} />
    </Routes>
    </div>
  );
}

export default App;
