import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import ProfileSetup from "./components/ProfileSetup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Profile from "./components/Profile.jsx";
import NavBar from "./components/NavBar.jsx";

function App() {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />  
      <Route path="/profile" element={<Profile />} /> 
    </Routes>
    </div>
  );
}

export default App;
