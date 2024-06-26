import React from 'react';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaPowerOff } from 'react-icons/fa';


const ProfileHeader = ({ username, newRequests, handleLogout }) => {
  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    // Check if str is null or undefined before attempting to capitalize
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Capitalize the username before rendering
  const capitalizedUsername = capitalizeFirstLetter(username);

  return (
    <div className="text-center pb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-4">Welcome, {capitalizedUsername}</h1>
          {/* Render the bell icon if there are new requests */}
          {newRequests.length > 0 && (
            <div className="relative mr-2">
              <FaBell size={22} className="text-black" />
              <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full w-4 h-6 flex items-center justify-center text-xs">
                {newRequests.length}
              </div>
            </div>
          )}
        </div>
        {/* Power button */}
        <Link to="/" onClick={handleLogout} style={{ padding: '10px' }}>
          <FaPowerOff size={14}/>
        </Link>
      </div>
      <p className="text-lg text-gray-600">Visitor's request</p>
    </div>
  );
};

export default ProfileHeader;
