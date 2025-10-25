import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
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

function App() {

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />  
      <Route path="/profile" element={<Profile />} /> 
      <Route path="/user-search" element={<SeeUsers />} />
      <Route path="/create-course" element={<CreateCourse />} />
      <Route path="/course-list" element={<CoursesList />} />
      <Route path="/course/:courseId" element={<Course />} />
    </Routes>
    </div>
  );
}

export default App;
