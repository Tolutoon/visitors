import React, { useEffect } from 'react';
import Keycloak from "keycloak-js";
import { useNavigate } from "react-router-dom";

const keycloak = new Keycloak({
  url: 'https://keycloak.issl.ng',
  realm: 'Testing',
  clientId: 'react-client'
});

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso' }).then((authenticated) => {
      if (authenticated) {
        console.log('User is authenticated');

        // Load user profile after authentication
        keycloak.loadUserProfile().then((profile) => {
          console.log('User Profile:', profile);

          // Check if the user is an admin
          const realmRoles = keycloak.realmAccess.roles;
          if (realmRoles && realmRoles.includes('admin')) {
            navigate('/log'); // Redirect to /log if the user is an admin
          } else {
            navigate(`/requests/${profile.attributes.staffid}`); // Redirect to another page with the staffId
          }
        }).catch((error) => {
          console.error('Error loading user profile:', error);
        });
      } else {
        console.log('User is not authenticated');
        keycloak.login(); // Redirect to Keycloak login page if not authenticated
      }
    }).catch((error) => {
      console.error('Error initializing Keycloak:', error);
    });
  }, [navigate]);

  return null; // This component doesn't render anything visible
}

export default Auth;
