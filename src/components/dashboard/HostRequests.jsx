import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HostRequests = ({hostsId}) => {
  return (
    <div className='py-8'>
      <FilteredCard hostId={hostsId} />
      <ToastContainer />
    </div>
  );
};

const FilteredCard = ({ hostId }) => {
  const [visitationRequests, setVisitationRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const visitationResponse = await axios.get("http://ezapi.issl.ng:3333/visitationrequest");
        setVisitationRequests(visitationResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter visitation requests based on staff ID and status not equal to "Approved"
  const filteredRequests = visitationRequests.filter((request) => request.staffid === hostId && request.status !== "Approved" && request.status !== "Declined");

  // If there are no requests matching the ID or all are approved, render a message
  if (filteredRequests.length === 0) {
    return <div className="text-center">You have no visitation requests</div>;
  }

  // Render the card with filtered requests
  return (
    <div>
      {filteredRequests.map((request) => (
        <Card key={request.id} request={request} setVisitationRequests={setVisitationRequests} />
      ))}
    </div>
  );
};

const Card = ({ request, setVisitationRequests }) => {
  const handleApprove = async () => {
    try {
      // Send PATCH request to update the request status to "Approved"
      await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${request.id}`, {
        status: "Approved",
        statusbystaffid: "Awaiting Check-In"
      });
      toast.success('Request approved successfully'); // Show toaster notification

      // Update the state to remove the approved request from the UI
      setVisitationRequests(prevRequests => prevRequests.filter(req => req.id !== request.id));
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };


  const handleDecline = async () => {
    try {
    // Send PATCH request to update status to "Declined"
    await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${request.id}`, {
        status: "Declined"
    });
    setVisitationRequests(prevRequests => prevRequests.filter(req => req.id !== request.id));
    toast.error("User request declined");
        
    } catch (error) {
        console.log("Error declining request:", error);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-4">
      <div className="p-12">
        <div className="text-xl font-medium text-gray-800 mb-4">Visitation Request</div>
        <div className="justify-between items-center mb-2">
          <div className='mb-4'>
            <div className="font-semibold text-gray-600">Approval Required</div>
            <div className="text-gray-700">You have a visitor that needs your approval to get in</div>
          </div>
          <div>
            <div className="font-semibold text-gray-600">Full Name</div>
            <div className="text-gray-700">{request.visitorname}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-600">Visitor Type</div>
            <div className="text-gray-700">Vendor</div>
          </div>
        </div>
        <div className="justify-between items-center mb-4">
          <div>
            <div className="font-semibold text-gray-600">Purpose for Visit</div>
            <div className="text-gray-700">Reasons</div>
          </div>
          <div>
            <div className="font-semibold text-gray-600">Private Note</div>
            <div className="text-gray-700">Private Note</div>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded mr-2" onClick={handleApprove}>
            Approve
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded" onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default HostRequests;
