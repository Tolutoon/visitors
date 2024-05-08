import React, { useState, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Header from '../header/Header';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from "axios";
import PopUpButton from "../PopUp";
import { Route } from 'react-router-dom';
import UserLogViewer from "./Log";

const DatePickerExample = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="datepicker" className="sr-only">
        Select Date
      </label>
      <DatePicker
        id="datepicker"
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        placeholderText="Select Date"
        className="w-full mt-1 py-4 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
      />
    </div>
  );
};


// const PopUpButton = ({ request }) => {
//   const [showPopUp, setShowPopUp] = useState(false);

//   return (
//     <div className="relative inline-block">
//       {showPopUp && (
//         <div className="absolute mt-8 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
//           <button onClick={() => setShowPopUp(false)} className="px-4 py-1 rounded-md text-gray-700 hover:bg-gray-300 focus:outline-none">
//             View Log
//           </button>
//         </div>
//       )}
//       <Link to={`/log/${request.id}`}>
//         <button className="ml-2" onClick={() => setShowPopUp(!showPopUp)}>
//           <HiOutlineDotsHorizontal className="cursor-pointer" />
//         </button>
//       </Link>
//     </div>
//   );
// };



const Visitors = () => {
  const [visitationRequests, setVisitationRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedVisitorType, setSelectedVisitorType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const visitationResponse = await axios.get("http://ezapi.issl.ng:3333/visitationrequest");
        const employeesResponse = await axios.get("http://ezapi.issl.ng:3333/employee", {
          headers: {
            accept: "application/json",
            "Range-Unit": "items"
          }
        });
        setVisitationRequests(visitationResponse.data);
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCheckIn = async (id) => {
    try {
      // Find the request with the given id
      const requestToUpdate = visitationRequests.find((request) => request.id === id);
      
      // Check if the user is approved
      if (requestToUpdate.status !== "Approved") {
        console.log("User is not approved yet. Check-in cannot be performed.");
        return;
      }
  
      // Toggle the status between "Signed In" and "Signed Out"
      const newStatus = requestToUpdate.statusbystaffid === "Signed In" ? "Signed Out" : "Signed In";
      const updatedRequests = visitationRequests.map((request) => {
        if (request.id === id) {
          return { ...request, statusbystaffid: newStatus };
        }
        return request;
      });
  
      setVisitationRequests(updatedRequests);
  
      if (newStatus === "Signed Out") {
        // Delete the user if signing out
        await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${id}`, {
          statusbystaffid: 'Signed Out',
        });

        console.log("User Signed Out.");
        toast.success('User Signed Out');
      } else {
        // Update the status if signing in
        await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${id}`, {
          statusbystaffid: newStatus
        });
        console.log("Patch successful. Visitor status updated.");
      }
    } catch (error) {
      console.error("Error updating visitation request:", error);
    }
  };
  
  // Function to find employee name by staffid
  const findEmployeeName = (staffid) => {
    const employee = employees.find((emp) => emp.staffid === staffid);
    return employee ? employee.name : "";
  };

  const handleVisitorTypeChange = (event) => {
    setSelectedVisitorType(event.target.value);
  };

  return (
    <div className="container mx-auto px-8">
      <Header/>
      
      <div className="flex max-w-600px justify-end">
        
      {/* Dropdown filter for visitor types */}
      <div className="py-4 border border-gray-300 rounded-md w-min px-2 mr-4">
        {/* <label htmlFor="visitorTypeFilter" className="mr-2">Filter by Visitor Type:</label> */}
        <select id="visitorTypeFilter" value={selectedVisitorType} onChange={handleVisitorTypeChange}>
          <option value="">All Visitors</option>
          <option value="Visitor">Visitor</option>
          <option value="Employee">Employee</option>
          {/* Add more visitor types as needed */}
        </select>
      </div>
      <div className="py-4 border border-gray-300 rounded-md w-min px-2 mr-2">
        {/* <label htmlFor="visitorTypeFilter" className="mr-2">Filter by Visitor Type:</label> */}
        <select id="visitorTypeFilter" value={selectedVisitorType} onChange={handleVisitorTypeChange}>
          <option value="">All</option>
          <option value="Visitor">Visitor</option>
          <option value="Employee">Employee</option>
          {/* Add more visitor types as needed */}
        </select>
      </div>
      <DatePickerExample/>
      </div>

      {/* End of dropdown filter */}

      <div className="grid grid-cols-9 gap-2 border-b border-gray-300 py-8 ">
        <div className="col-span-1 text-center">Visitor's name</div>
        <div className="col-span-1 text-center">Visitor's Type</div>
        <div className="col-span-1 text-center">Arrival Time</div>
        <div className="col-span-1 text-center">To see</div>
        <div className="col-span-1 text-center">Purpose</div>
        <div className="col-span-1 text-center">Host Decision</div>
        <div className="col-span-1 text-center">Visitor's status</div>
      </div>

      {visitationRequests.filter(request => request.statusbystaffid !== 'Signed Out').length === 0 ? (
  <div className="text-center py-4">No visitor's log</div>
) : (
  <div>
    {visitationRequests
      .filter(request => request.statusbystaffid !== 'Signed Out') // Filter out visitors with status 'Signed Out'
      .map(request => (
        <div
          className="grid grid-cols-9 gap-2 border-b border-gray-300 py-6 items-center justify-center"
          key={request.id}
        >
          <div className="col-span-1 text-center font-bold">{request.visitorname}</div>
          <div className="col-span-1 text-center">Visitor</div>
          <div className="col-span-1 text-center">{request.plannedvisittime}</div>
          <div className="col-span-1 text-center font-bold">{request.hostname}</div>
          <div className="col-span-1 text-center">Official</div>
          <div className="col-span-1 text-center" style={{ color: request.status === 'Approved' ? 'green' : request.status === 'Rescheduled' ? '#A4A40A' : 'red' }}>{request.status}</div>
          <div className="col-span-1 text-center">{request.statusbystaffid}</div>
          <button 
            onClick={() => handleCheckIn(request.id)}
            style={{
              backgroundColor: request.status !== 'Approved' || request.statusbystaffid === 'Signed Out' ? 'grey' : request.statusbystaffid === 'Signed In' ? 'red' : 'green',
              padding: '10px 10px',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {request.statusbystaffid === 'Signed In' ? 'Check out' : 'Check in'}
          </button>
          <PopUpButton requestId={request.id} /> {/* Pass request as a prop to PopUpButton */}
        </div>
      ))}
  </div>
)}

      <ToastContainer />
    </div>
  );
};

export default Visitors;
