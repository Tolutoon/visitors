import React, { useState, useEffect } from "react";
import Header from '../components/header/Header';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import PopUpButton from "../components/common/PopUp";

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
      const requestToUpdate = visitationRequests.find((request) => request.id === id);
      if (requestToUpdate.status !== "Approved") {
        console.log("User is not approved yet. Check-in cannot be performed.");
        return;
      }
  
      const newStatus = requestToUpdate.statusbystaffid === "Signed In" ? "Signed Out" : "Signed In";
      const updatedRequests = visitationRequests.map((request) => {
        if (request.id === id) {
          return { ...request, statusbystaffid: newStatus };
        }
        return request;
      });
  
      setVisitationRequests(updatedRequests);
  
      await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${id}`, {
        statusbystaffid: newStatus,
      });

      console.log("Patch successful. Visitor status updated.");
      toast.success(newStatus === "Signed Out" ? 'User Signed Out' : 'User Signed In');
    } catch (error) {
      console.error("Error updating visitation request:", error);
    }
  };
  
  const handleVisitorTypeChange = (event) => {
    setSelectedVisitorType(event.target.value);
  };

  return (
    <div className="container mx-auto px-8">
      <Header/>
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto justify-between items-center py-4 md:justify-end">
  <div className="w-full md:w-auto flex items-center md:justify-end">
    <div className="py-4 border border-gray-300 rounded-md w-min px-2 md:mr-4">
      <select id="visitorTypeFilter" value={selectedVisitorType} onChange={handleVisitorTypeChange}>
        <option value="">All Visitors</option>
        <option value="Visitor">Visitor</option>
        <option value="Employee">Employee</option>
      </select>
    </div>
    <div className="py-4 border border-gray-300 rounded-md w-min px-2 mr-2">
      <select id="visitorTypeFilter" value={selectedVisitorType} onChange={handleVisitorTypeChange}>
        <option value="">All</option>
        <option value="Visitor">Visitor</option>
        <option value="Employee">Employee</option>
      </select>
    </div>
    <DatePickerExample/>
  </div>
</div>

      <div className="grid grid-cols-1 md:grid-cols-9 gap-2 border-b border-gray-300 py-8 ">
        <div className="col-span-1 text-center md:col-span-1">Visitor's name</div>
        <div className="col-span-1 text-center md:col-span-1">Visitor's Type</div>
        <div className="col-span-1 text-center md:col-span-1">Arrival Time</div>
        <div className="col-span-1 text-center md:col-span-1">To see</div>
        <div className="col-span-1 text-center md:col-span-1">Purpose</div>
        <div className="col-span-1 text-center md:col-span-1">Host Decision</div>
        <div className="col-span-1 text-center md:col-span-1">Visitor's status</div>
      </div>
      {visitationRequests.filter(request => request.statusbystaffid !== 'Signed Out').length === 0 ? (
        <div className="text-center py-4">No visitor's log</div>
      ) : (
        <div>
          {visitationRequests
            .filter(request => request.statusbystaffid !== 'Signed Out')
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map(request => (
              <div
                className="grid grid-cols-1 md:grid-cols-9 gap-2 border-b border-gray-300 py-6 items-center justify-center"
                key={request.id}
              >
                <div className="col-span-1 md:col-span-1 text-center font-bold">{request.visitorname}</div>
                <div className="col-span-1 md:col-span-1 text-center">Visitor</div>
                <div className="col-span-1 md:col-span-1 text-center">{request.plannedvisittime}</div>
                <div className="col-span-1 md:col-span-1 text-center font-bold">{request.hostname}</div>
                <div className="col-span-1 md:col-span-1 text-center">Official</div>
                <div className="col-span-1 md:col-span-1 text-center" style={{ color: request.status === 'Approved' ? 'green' : request.status === 'Rescheduled' ? '#A4A40A' : 'red' }}>{request.status}</div>
                <div className="col-span-1 md:col-span-1 text-center">{request.statusbystaffid}</div>
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
                <PopUpButton requestId={request.id} /> 
              </div>
            ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Visitors;
