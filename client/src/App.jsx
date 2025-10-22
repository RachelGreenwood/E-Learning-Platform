import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import ProfileSetup from "./components/ProfileSetup.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  // If user already has a profile, go to Dashboard page. If not, go to Profile Setup page
  useEffect(() => {
    const checkProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });

        const response = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 404) {
          navigate("/profile-setup"); // New user → profile setup
        } else if (response.ok) {
          navigate("/dashboard"); // Returning user → dashboard
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      }
    };

    checkProfile();
  }, [isAuthenticated]);

  return (
    <div>
      {/* If user isn't logged in, show Log In button. If user is logged in, show Log Out button and personalized welcome */}
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
          </button>
        </>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />    
    </Routes>
    </div>
  );
}

export default App;
