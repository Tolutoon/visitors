import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

const PopUpButton = ({ requestId }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  return (
    <div className="relative inline-block">
      {showPopUp && (
        <div className="absolute mt-8 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <Link to={`/log/${requestId}`}>
            <button onClick={() => setShowPopUp(false)} className="px-4 py-1 rounded-md text-gray-700 hover:bg-gray-300 focus:outline-none">
              View Log
            </button>
          </Link>
        </div>
      )}
      <button className="ml-2" onClick={() => setShowPopUp(!showPopUp)}>
        <HiOutlineDotsHorizontal className="cursor-pointer" />
      </button>
    </div>
  );
  
  
};

export default PopUpButton;
