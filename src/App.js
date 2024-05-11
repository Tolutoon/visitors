import { Routes, Route } from "react-router-dom";
import RequestsWithUserId from "./utils/RequestsWithUserId";
import Visitors from './views/Visitors';
import Form from "./components/form/VisitorsForm";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // State to store user profile

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso' }).then((authenticated) => {
      if (authenticated) {
        console.log('User is authenticated');
        setAuthenticated(true);

        const realmRoles = keycloak.realmAccess.roles;
        console.log(realmRoles);
        if (realmRoles && realmRoles.includes('admin')) {
          setIsAdmin(true);
        }

        // Load user profile after authentication
        keycloak.loadUserProfile().then((profile) => {
          console.log('User Profile:', profile);
          setUserProfile(profile);
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
      {/* Conditionally render the routes based on authenticated state */}
      {authenticated ? (
        <>
          <Route path='/log' element={<Visitors/>}/>
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
