import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const createProfile = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch("http://localhost:5000/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            email: user.email,
            username: user.name,
            discipline: "MMA",
            role: "Student",
          }),
        });

        if (!response.ok) throw new Error("Failed to sync profile");

        const profile = await response.json();
        console.log("Profile synced:", profile);
      } catch (err) {
        console.error("Error syncing profile:", err);
      }
    };

    createProfile();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return (
    <div>
       {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
          </button>
          <h2>Welcome, {user.name}</h2>
        </>
      )}
      <h1>Kyu To Dan</h1>
    </div>
  );
}

export default App;
