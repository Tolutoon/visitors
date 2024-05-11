import React from 'react';

const ProfileHeader = ({ username }) => {
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
      <h1 className="text-2xl font-bold mb-4">Welcome {capitalizedUsername}</h1>
      <p className="text-lg text-gray-600">Visitor's request</p>
    </div>
  );
};

export default ProfileHeader;
