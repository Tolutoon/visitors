import React, { useState, useEffect } from "react";
import axios from "axios";

const Visitors = () => {
  const [visitationRequests, setVisitationRequests] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchVisitationRequests = async () => {
      try {
        const response = await axios.get(
          "http://ezapi.issl.ng:3333/visitationrequest"
        );
        setVisitationRequests(response.data);
      } catch (error) {
        console.error("Error fetching visitation requests:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://ezapi.issl.ng:3333/employee",
          {
            headers: {
              accept: "application/json",
              "Range-Unit": "items"
            }
          }
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
    fetchVisitationRequests();
  }, []);

  const handleCheckIn = async (id) => {
    try {
      const updatedRequests = visitationRequests.map((request) => {
        if (request.id === id) {
          return { ...request, hostDecision: !request.hostDecision };
        }
        return request;
      });
      setVisitationRequests(updatedRequests);

      const updatedHostDecision = !updatedRequests.find((req) => req.id === id).status;
      console.log("Updated host decision:", updatedHostDecision);

      await axios.put(`http://ezapi.issl.ng:3333/visitationrequest/${id}`, {
        hostDecision: updatedHostDecision
      });
    } catch (error) {
      console.error("Error updating visitation request:", error);
    }
  };

  // Function to find employee name by staffid
  const findEmployeeName = (staffid) => {
    const employee = employees.find((emp) => emp.staffid === staffid);
    return employee ? employee.name : "";
  };
  

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-8 gap-2 border-b border-gray-300 py-8">
        <div className="col-span-1 text-center">Visitor's name</div>
        <div className="col-span-1 text-center">Visitor's Type</div>
        <div className="col-span-1 text-center">Arrival Time</div>
        <div className="col-span-1 text-center">To see</div>
        <div className="col-span-1 text-center">Purpose</div>
        <div className="col-span-1 text-center">Host Decision</div>
        <div className="col-span-1 text-center">Visitor's status</div>
      </div>

      <div>
        {visitationRequests.map((request) => (
          <div
            className="grid grid-cols-8 gap-2 border-b border-gray-300 py-6"
            key={request.id}
          >
            <div className="col-span-1 text-center font-bold">{request.visitorname}</div>
            <div className="col-span-1 text-center">{request.visitorphone}</div>
            <div className="col-span-1 text-center">{request.plannedvisittime}</div>
            <div className="col-span-1 text-center">{findEmployeeName(request.staffid)}</div>
            <div className="col-span-1 text-center">{request.staffid}</div>
            <div className="col-span-1 text-center">{request.status}</div>
            <div className="col-span-1 text-center" style={{color: request.hostDecision ? 'green' : 'red'}}>
              {request.hostDecision ? 'Accepted' : 'Rejected'}
            </div>
            <button onClick={() => handleCheckIn(request.id)}>
              {request.hostDecision ? 'Check out' : 'Check in'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Visitors;
