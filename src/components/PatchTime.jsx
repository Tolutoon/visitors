import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatchRequestAtTime = () => {
  const [status, setStatus] = useState('');

  // Function to send a PATCH request at a specified time
  const sendPatchRequestAtTime = (time) => {
    // Get the current time
    const currentTime = new Date().getTime();
    // Calculate the time difference between current time and the specified time
    const timeDifference = time - currentTime;

    // If the time difference is negative, it means the specified time has already passed
    if (timeDifference <= 0) {
      console.error('Specified time has already passed');
      return;
    }

    // Set a timeout to execute the PATCH request after the specified time
    setTimeout(async () => {
      try {
        // Make the PATCH request
        const response = await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.304`, {
          status: "Pending",
          statusbystaffid: "Awaiting Check In"
        });
        console.log('Patch Successful');
        setStatus(response.data.message); 
      } catch (error) {
        console.error('Error sending PATCH request:', error);
      }
    }, timeDifference);
  };

  // Function to handle sending PATCH request
  const handleSendPatchRequest = () => {
    const timeToExecute = new Date(); // Current date
    timeToExecute.setHours(14, 29, 0, 0); // Set time to 11:21 AM
    sendPatchRequestAtTime(timeToExecute.getTime()); // Pass the time in milliseconds
  };


  useEffect(() => {
    handleSendPatchRequest();
  }, []);

  return (
    <div>
      {/* No button needed */}
      {status && <div>Status: {status}</div>}
    </div>
  );
};

export default PatchRequestAtTime;
