import React, { useState, useEffect } from "react";
import axios from "axios";

const Hosts = () => {
  const [visitationRequests, setVisitationRequests] = useState([]);
  const [employees, setEmployees] = useState([]);

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

  // Filter visitation requests based on specific staff ID
  const filteredRequests = visitationRequests.filter((request) => request.staffid === '1234');

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-8 gap-2 border-b border-gray-300 py-8">
        <div className="col-span-1 text-center">Visitor's name</div>
        <div className="col-span-1 text-center">Visitor's Type</div>
        <div className="col-span-1 text-center">Arrival Time</div>

        <div className="col-span-1 text-center">Purpose</div>
      
        <div className="col-span-1 text-center">Visitor's status</div>
      </div>

      <div>
        {filteredRequests.map((request) => (
          <div
            className="grid grid-cols-8 gap-2 border-b border-gray-300 py-6"
            key={request.id}
          >
            <div className="col-span-1 text-center font-bold">{request.visitorname}</div>
            <div className="col-span-1 text-center">Visitor</div>
            <div className="col-span-1 text-center">{request.plannedvisittime}</div>
            <div className="col-span-1 text-center">Official</div>
            <div className="col-span-1 text-center" style={{color: request.hostDecision ? 'green' : 'red'}}>
              {request.hostDecision ? 'Accepted' : 'Declined'}
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

export default Hosts;
