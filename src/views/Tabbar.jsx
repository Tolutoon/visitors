import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import DatePickerExample from '../components/common/DatePickers';
import TimePicker from '../components/common/TimePicker';
import { FaClock } from "react-icons/fa";
import { BsFillPersonLinesFill } from "react-icons/bs";
import PatchRequestAtTime from '../components/common/PatchTime';
import ProfileHeader from '../components/header/ProfileHeader';

const TabHostRequests = ({ hostsId, userProfile }) => {
    return (
        <div className='py-8'>
              <ProfileHeader username={userProfile}/>
          <Tabs>
          <TabList className="flex justify-center bg-gray-100 p-4 rounded-t-xl mb-4">
              <Tab className="text-gray-700 px-4 py-2 mr-2 rounded cursor-pointer hover:bg-gray-300">New</Tab>
              <Tab className="text-gray-700 px-4 py-2 mr-2 rounded cursor-pointer hover:bg-gray-300">Rescheduled</Tab>
              <Tab className="text-gray-700 px-4 py-2 mr-2 rounded cursor-pointer hover:bg-gray-300">Closed</Tab>
            </TabList>
            <TabPanel>
              <FilteredCard hostId={hostsId} />
            </TabPanel>
            <TabPanel>
              <RescheduledVisitation hostId={hostsId} />
            </TabPanel>
            <TabPanel>
              <PatchRequestAtTime/>
            </TabPanel>
          </Tabs>
          <ToastContainer />
        </div>
      );
};

const FilteredCard = ({ hostId }) => {
    const [visitationRequests, setVisitationRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showReferModal, setShowReferModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRescheduledVisits, setShowRescheduledVisits] = useState(false);
  
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
      request.status !== "Rescheduled"
    );
  
    return (
      <div>
        {/* <div className="flex justify-center mb-4">
          <button className="bg-black hover:bg-black text-white font-semibold px-8 py-2 rounded" onClick={() => setShowRescheduledVisits(!showRescheduledVisits)}>
            {showRescheduledVisits ? 'Hide Rescheduled Visits' : 'Show Rescheduled Visits'}
          </button>
        </div> */}
        {showRescheduledVisits && <RescheduledVisitation hostId={hostId} />}
        {filteredRequests.map((request) => (
          <Card key={request.id} request={request} setShowModal={setShowModal} setSelectedRequest={setSelectedRequest} setShowReferModal={setShowReferModal} setVisitationRequests={setVisitationRequests} />
        ))}
        {showModal && <RescheduleModal request={selectedRequest} setShowModal={setShowModal} />}
        {showReferModal && filteredRequests.map((request) => (
  <ReferModal key={request.id} request={filteredRequests.find((request) => request.id === selectedRequest.id)} setShowReferModal={setShowReferModal} currentStaffId={hostId} />
))}
      </div>
    );
  };

const Card = ({ request, setShowModal, setSelectedRequest, setShowReferModal, setVisitationRequests }) => {
    const handleApprove = async () => {
        try {
            await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${request.id}`, {
                status: "Approved",
                statusbystaffid: "Awaiting Check-In"
            });
            toast.success('Request approved successfully');
            setVisitationRequests(prevRequests => prevRequests.filter(req => req.id !== request.id));
        } catch (error) {
            console.error("Error approving request:", error);
        }
    };

    const handleRefer = () => {
        setSelectedRequest(request); // Pass the selected request to the modal
        setShowReferModal(true);
    };

    const handleReschedule = () => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const handleDecline = async () => {
        try {
            await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${request.id}`, {
                status: "Declined",
                statusbystaffid: "Declined Visitation"
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
                    <button className="border border-black hover:bg-black hover:text-white text-black font-semibold px-4 py-2 mr-2 rounded w-full" onClick={handleRefer}>
                        <BsFillPersonLinesFill />
                    </button>
                    <button className='flex items-center justify-center px-4 py-2 border hover:text-white border-yellow-500 bg-white-400 text-yellow-500 hover:bg-yellow-500 rounded-md mr-2 w-full' onClick={handleReschedule}>
                        <FaClock />
                    </button>
                    <button className="border border-red-500 hover:bg-red-500 hover:text-white text-red-500 font-semibold px-4 py-2 mr-2 rounded w-fit" onClick={handleDecline}>
                        Decline
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 mr-2 rounded w-fit" onClick={handleApprove}>
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
};


  const RescheduleModal = ({ request, setShowModal }) => {
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
  
    const handleTimeChange = (time) => {
      setSelectedTime(time);
    };
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    const handleCloseModal = () => {
      setShowModal(false);
    };
  
    const handleReschedule = async () => {
      try {
        // Convert the selected date to ISO date string format
        const isoDateString = new Date(selectedDate).toString();
        await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${request.id}`, {
          hostofficeextensiom: selectedTime,
          plannedvisitdate: "2024-05-16",
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
  
  
  const ReferModal = ({ request, setShowReferModal, currentStaffId }) => {
    const handleCloseModal = () => {
      setShowReferModal(false);
    };
  
    const [employees, setEmployees] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
  
    useEffect(() => {
      const fetchEmployees = async () => {
        try {
          const response = await axios.get('http://ezapi.issl.ng:3333/employee');
          setEmployees(response.data);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
  
      fetchEmployees();
    }, []);
  
    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    };
  
    const handleRefer = async () => {
      // Check if a name is selected
      if (selectedOption) {
        // Find the selected employee
        const selectedEmployee = employees.find((employee) => employee.name === selectedOption);
        
        // Check if the employee object is found
        if (selectedEmployee) {
          try {
            // Make the PATCH request to update the visitor
            await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${request.id}`, {
              // Update the staffid and hostname according to the selected employee
              staffid: selectedEmployee.staffid,
              hostname: selectedOption
            });
      
            // Log a success message
            console.log('PATCH request sent successfully to update visitor:', request.id);
            toast.success("Referred Successfully");
          } catch (error) {
            // Log an error message if the PATCH request fails
            console.error('Error sending PATCH request to update visitor:', error);
          }
        } else {
          console.error('Selected employee not found');
        }
      } else {
        console.error('No employee name selected');
      }
      handleCloseModal();
    };
    
    
    
    
  
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center h-full pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xs sm:w-full" style={{ height: '30vh' }}>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={handleCloseModal}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Refer To:</h3>
                  <div className="mt-2">
                    <select value={selectedOption} onChange={handleSelectChange} className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="">Select a host</option>
                      {employees
                        .filter((employee) => employee.staffid !== currentStaffId)
                        .map((employee) => (
                          <option key={employee.id} value={employee.name}>
                            {employee.name}
                          </option>
                        ))}
                    </select>
                    <button onClick={handleRefer} className="mt-8 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black focus:outline-none focus:ring-2 focus:ring-offset-2">
                      Refer
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

  const RescheduledVisitation = ({ hostId }) => {
    const [rescheduledVisits, setRescheduledVisits] = useState([]);
  
    useEffect(() => {
      const fetchRescheduledVisits = async () => {
        try {
          const response = await axios.get("http://ezapi.issl.ng:3333/visitationrequest");
          const filteredVisits = response.data.filter((visit) => visit.status === "Rescheduled" && visit.staffid === hostId);
          setRescheduledVisits(filteredVisits);
        } catch (error) {
          console.error("Error fetching rescheduled visits:", error);
        }
      };
  
      fetchRescheduledVisits();
    }, [hostId]);
  
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

export default TabHostRequests;
