import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePickerExample from '../DatePickers';
import TimePicker from '../TimePicker';
import PatchRequestAtTime from '../PatchTime';
import { FaClock } from "react-icons/fa6";
import { BsFillPersonLinesFill } from "react-icons/bs";


const HostRequests = ({ hostsId }) => {
  return (
    <div className='py-8'>
      <FilteredCard hostId={hostsId} />
      <PatchRequestAtTime/>
      <ToastContainer />
    </div>
  );
};


const FilteredCard = ({ hostId }) => {
  const [visitationRequests, setVisitationRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRescheduledVisits, setShowRescheduledVisits] = useState(false); // State to control visibility of rescheduled visits

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

  const filteredRequests = visitationRequests.filter((request) =>
    request.staffid === hostId &&
    request.status !== "Approved" &&
    request.status !== "Declined" &&
    request.status !== "Rescheduled" // Exclude requests with status "Rescheduled"
  );

  return (
    <div>
      {/* Button to toggle visibility of rescheduled visits */}
      <div className="flex justify-center mb-4">
        <button className="bg-black hover:bg-bl text-white font-semibold px-8 py-2 rounded" onClick={() => setShowRescheduledVisits(!showRescheduledVisits)}>
          {showRescheduledVisits ? 'Hide Rescheduled Visits' : 'Show Rescheduled Visits'}
        </button>
      </div>
      {/* Render rescheduled visits component */}
      {showRescheduledVisits && <RescheduledVisitation />}
      {/* Render filtered requests */}
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
      await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${request.id}`, {
        status: "Approved",
        statusbystaffid: "Awaiting Check-In"
      });
      toast.success('Request approved successfully');
      
      // Remove the approved request from the UI immediately
      setVisitationRequests(prevRequests => prevRequests.filter(req => req.id !== request.id));
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleReschedule = () => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleDecline = async () => {
    try {
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
        <div className="flex">
        <button className="bg-black hover:bg-black text-white font-semibold px-8 py-2 mb-2 rounded w-full">
        <BsFillPersonLinesFill />
          </button>
          <button className='flex items-center justify-center px-4 py-2 border border-yellow-500 bg-white-400 text-yellow-500 rounded-md mb-2 w-full' onClick={handleReschedule}> <FaClock /></button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-2 mb-2 rounded w-fit" onClick={handleApprove}>
            Approve
          </button>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-2 mb-2 rounded w-fit" onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ request, setShowModal }) => {
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    console.log(selectedTime);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
   
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleReschedule = async () => {
    try {
      const isoDateString = selectedDate.toString;
      // console.log(isoDateString.toString);
  
      await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${request.id}`, {
        hostofficeextensiom: selectedTime,
        plannedvisitdate: isoDateString,
        status: 'Rescheduled',
        statusbystaffid: "Rescheduled Visitation"
      });
      toast.success('User Rescheduled successfully');
      handleCloseModal();
    } catch (error) {
      console.log("Error Rescheduling:", error);
    }
  };


  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center h-full pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xs sm:w-full" style={{ height: '48vh' }}>
          <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={handleCloseModal}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Reschedule Visit</h3>
                <div className="mt-2">
                  <DatePickerExample onChange={handleDateChange} />
                  <TimePicker onChange={handleTimeChange} label="Select a Time"/>
                  {/* <PatchRequestAtTime time={selectedTime} request={request.id} /> */}
                  <button 
                    onClick={handleReschedule} 
                    type="button" 
                    className={`mt-4 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${selectedTime ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500' : 'bg-gray-400 text-gray-600 cursor-not-allowed'}`}
                    disabled={!selectedTime}
                  >
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


const RescheduledVisitation = () => {
  const [rescheduledVisits, setRescheduledVisits] = useState([]);

  useEffect(() => {
    const fetchRescheduledVisits = async () => {
      try {
        const response = await axios.get("http://ezapi.issl.ng:3333/visitationrequest");
        // Filter users with the status of "Rescheduled"
        const filteredVisits = response.data.filter((visit) => visit.status === "Rescheduled");
        setRescheduledVisits(filteredVisits);
      } catch (error) {
        console.error("Error fetching rescheduled visits:", error);
      }
    };

    fetchRescheduledVisits();
  }, []);

  // const PatchRequestAtTime = ({ time, request }) => {
  //   const [status, setStatus] = useState('');
  
  //   useEffect(() => {
  //     // Function to send a PATCH request at a specified time
  //     const sendPatchRequestAtTime = (time, request) => {
  //       // Calculate the time difference between current time and the specified time
  //       const timeDifference = time - new Date().getTime();
  
  //       // If the time difference is negative, it means the specified time has already passed
  //       if (timeDifference <= 0) {
  //         console.error('Specified time has already passed');
  //         return;
  //       }
  
  //       // Set a timeout to execute the PATCH request after the specified time
  //       setTimeout(async () => {
  //         try {
  //           // Make the PATCH request
  //           const response = await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${request.id}`, {
  //             status: "Pending",
  //             statusbystaffid: "Awaiting Check In"
  //           });
  //           console.log('Patch Successful'); // Log success message
  //           setStatus(response.data.message); // Update status state with response message
  //         } catch (error) {
  //           console.error('Error sending PATCH request:', error);
  //         }
  //       }, timeDifference);
  //     };
  
  //     // Log the current time before executing the PATCH request
  //     const currentTime = new Date().getTime();
  //     console.log('Current Time:', currentTime);
  //     sendPatchRequestAtTime(time, request);
  //   }, [time, request]);
  
  //   return (
  //     <div>
  //       {/* No button needed */}
  //       {status && <div>Status: {status}</div>}
  //     </div>
  //   );
  // };

  

  return (
    <div className="flex justify-center">
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Rescheduled Visits</h2>
        {rescheduledVisits.length === 0 ? (
          <div className="text-gray-600">No rescheduled visits found</div>
        ) : (
          <div>
            {rescheduledVisits.map((visit) => (
              <div key={visit.id} className="border border-gray-300 rounded-md p-4 mb-2">
                <div className="font-semibold">{visit.visitorname}</div>
                <div>{visit.plannedvisitdate}</div>
                <div>{visit.hostofficeextensiom}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostRequests;
