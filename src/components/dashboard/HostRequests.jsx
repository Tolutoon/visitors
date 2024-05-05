import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaClock } from 'react-icons/fa';
import DatePickerExample from '../DatePickers';
import TimePicker from '../TimePicker';


const HostRequests = ({ hostsId }) => {
  return (
    <div className='py-8'>
      <FilteredCard hostId={hostsId} />
      <ToastContainer />
    </div>
  );
};

const FilteredCard = ({ hostId }) => {
  const [visitationRequests, setVisitationRequests] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedRequest, setSelectedRequest] = useState(null); // State to store the selected request

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
        <Card key={request.id} request={request} setVisitationRequests={setVisitationRequests} setShowModal={setShowModal} setSelectedRequest={setSelectedRequest} />
      ))}
      {showModal && <Modal request={selectedRequest} setShowModal={setShowModal} />}
    </div>
  );
};

const Card = ({ request, setVisitationRequests, setShowModal, setSelectedRequest }) => {
  
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

  const handleReschedule = () => {
    // Set selected request and show modal
    setSelectedRequest(request);
    setShowModal(true);
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
            <div className="text-gray-700">Visitor</div>
          </div>
        </div>
        <div className="justify-between items-center mb-4">
          <div>
            <div className="font-semibold text-gray-600">Purpose for Visit</div>
            <div className="text-gray-700">Official</div>
          </div>
          <div>
            <div className="font-semibold text-gray-600">Private Note</div>
            <div className="text-gray-700">{request.hostemailaddress}</div>
          </div>
        </div>
        <div className="flex justify-center">
          <button className='flex items-center px-4 py-2 border border-yellow-500 bg-white-400 text-yellow-500 rounded-md mr-2' onClick={handleReschedule}> <FaClock /></button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 mr-2 rounded" onClick={handleDecline}>
            Decline
          </button>
          {/* <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 mr-2 rounded" onClick={handleReschedule}>
            Reschedule
          </button> */}
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded" onClick={handleApprove}>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ request, setShowModal }) => {
  const [selectedTime, setSelectedTime] = useState('');
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleReschedule = () => {
    // Add your logic for rescheduling here
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center h-full pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xs sm:w-full" style={{ height: '48vh' }}>

          {/* Cancel sign */}
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={handleCloseModal}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Modal Content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Reschedule Visit</h3>
                <div className="mt-2">
                  {/* Date picker */}
                  <DatePickerExample />
                  {/* Time Picker */}
                  <TimePicker onChange={handleTimeChange} label="Select a Time"/>
                  {/* Reschedule button */}
                  <button onClick={handleReschedule} type="button" className="mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:w-auto sm:text-sm">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};





export default HostRequests;
