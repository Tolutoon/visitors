import React from 'react';

const ProfileHeader = ({ username }) => {
  return (
    <div className="text-center pb-8">
      <h1 className="text-2xl font-bold mb-4">Welcome {username}</h1>
      <p className="text-lg text-gray-600">Visitor's request</p>
    </div>
  );
};

export default ProfileHeader;
