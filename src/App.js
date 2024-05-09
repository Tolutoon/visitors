import { Routes, Route } from "react-router-dom";
// import HostRequests from './components/dashboard/HostRequests';
import RequestsWithUserId from "./components/RequestsWithUserId";
import Visitors from './components/dashboard/Visitors';
import FormFloatingBasicExample from "./components/Form/VisitorsForm";
import UserLogViewer from "./components/dashboard/Log";
import LogRequestId from "./LogRequest";
import Homepage from "./components/dashboard/HomePage";
import Keycloak from "keycloak-js";
import { useState, useEffect } from "react";

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
      }
    });
  }, []);

  return (
  <Routes>
    <Route path='/log' element={<Visitors/>}/>
    <Route path="/form" element={<FormFloatingBasicExample/>}/>
    <Route path='/requests/:userId' element={<RequestsWithUserId />} />
    <Route path="/log/:userId" element={<LogRequestId />}/>
    <Route path="/" element={<Homepage/>}/>
    {/* <Route path='/requests' element={<HostRequests hostsId={'1234'}/>}/> */}
    {/* <Route path="/host" element={<Hosts hostId={'1234'} visitorId={'87654321'}/>}/> */}
  </Routes>
  );
}

export default App;
