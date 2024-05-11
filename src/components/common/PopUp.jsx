import React, { useState} from 'react';
import UserLogViewer from '../cards/Log'; // Import the UserLogViewer component
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

const PopUpButton = ({ requestId }) => {
  const [showPopUp, setShowPopUp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  return (
    <div className="relative inline-block">
      {showPopUp && (
        <div className="absolute mt-8 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <button onClick={() => setShowModal(true)} className="px-4 py-1 rounded-md text-gray-700 hover:bg-gray-300 focus:outline-none">
            View Log
          </button>
        </div>
      )}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md shadow-lg">
            {/* Replace the placeholder content with the UserLogViewer component */}
            <UserLogViewer requestId={requestId} />
            <button onClick={() => setShowModal(false)} className="px-4 py-1 rounded-md text-gray-700 hover:bg-gray-300 focus:outline-none">
              Close
            </button>
          </div>
        </div>
      )}
      <button className="ml-2" onClick={() => setShowPopUp(!showPopUp)}>
        <HiOutlineDotsHorizontal className="cursor-pointer" />
      </button>
    </div>
  );
};

export default PopUpButton;
