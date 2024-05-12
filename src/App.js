import { Routes, Route, Navigate } from "react-router-dom";
import RequestsWithUserId from "./utils/RequestsWithUserId";
import Visitors from './views/Visitors';
import Form from "./views/VisitorsForm";
import LogRequestId from "./LogRequest";
import Homepage from "./views/HomePage";
import Keycloak from "keycloak-js";
import { useState, useEffect } from "react";
import Auth from "./utils/Auth";

const keycloak = new Keycloak({
  url: 'https://keycloak.issl.ng',
  realm: 'Testing',
  clientId: 'react-client'
});

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // State to store user profile

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso' }).then((authenticated) => {
      if (authenticated) {
        console.log('User is authenticated');
        setAuthenticated(true);

        // Load user profile after authentication
        keycloak.loadUserProfile().then((profile) => {
          setUserProfile(profile);
          // Check if the user has the admin role
          const realmRoles = keycloak.realmAccess.roles;
          if (realmRoles && realmRoles.includes('admin')) {
            setIsAdmin(true);
          }
        }).catch((error) => {
          console.error('Error loading user profile:', error);
        });
      } else {
        console.log('User is not authenticated');
        setAuthenticated(false); // Update authenticated state
      }
    });
  }, []);

  return (
    <Routes>
      {/* Conditionally render the routes based on authenticated and admin state */}
      {authenticated ? (
        <>
          {isAdmin ? (
            <Route path='/log' element={<Visitors/>}/>
          ) : (
            <Route path='/home' element={<Navigate to="/home" />} />
          )}
          {/* Pass the username from userProfile as a prop to RequestsWithUserId */}
          <Route path='/requests/:userId' element={<RequestsWithUserId userProfile={userProfile ? userProfile.username : null} />} />
          <Route path="/log/:userId" element={<LogRequestId />}/>
        </>
      ) : null}
      <Route path="/form" element={<Form/>}/>
      <Route path="/home" element={<Homepage/>}/>
      <Route path="/" element={<Auth/>}/>
    </Routes>
  );
}

export default App;
