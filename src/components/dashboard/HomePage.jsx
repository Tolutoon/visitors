import React, { useEffect } from 'react';
import Typewriter from "typewriter-effect";
import Keycloak from "keycloak-js";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from '../../assets/homepagebg.png'; // Importing the background image

const keycloak = new Keycloak({
  url: 'https://keycloak.issl.ng',
  realm: 'Testing',
  clientId: 'react-client'
});

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso' }).then((authenticated) => {
      if (authenticated) {
        console.log('User is authenticated');
        // Redirect to /log if user is authenticated
        navigate('/log');
      } else {
        console.log('User is not authenticated');
      }
    }).catch((error) => {
      console.error('Error initializing Keycloak:', error);
    });
  }, [navigate]);

  const handleLogin = () => {
    keycloak.login();
  };

  return (
    <div
      className="relative bg-cover bg-center h-screen flex flex-col justify-center items-center"
      style={{backgroundImage: `url(${backgroundImage})`}} // Adding background image
    >
      <div className="absolute top-4 right-4">
        <button onClick={handleLogin} className="bg-black text-white px-4 py-2 rounded-md hover:bg-opacity-80">
          Login
        </button>
      </div>
      <div className="text-black text-5xl font-bold mb-8">
        <Typewriter
          options={{
            strings: ["Welcome to ISSL"],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
      <p className="text-black text-lg mb-8">
        Please fill out the visitation form to register your visit and notify your host
      </p>
      <Link to="/form">
        <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-opacity-80">
          Fill Visitation Form
        </button>
      </Link>
    </div>
  );
}

export default Homepage;
