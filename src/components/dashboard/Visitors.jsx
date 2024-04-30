import React, { useState, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Header from '../header/Header';
import axios from "axios";

const Visitors = () => {
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
  
      await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${id}`, {
        statusbystaffid: newStatus
      });
  
      console.log("Patch successful. Visitor status updated.");
    } catch (error) {
      console.error("Error updating visitation request:", error);
    }
  };
  
  


  // Function to find employee name by staffid
  const findEmployeeName = (staffid) => {
    const employee = employees.find((emp) => emp.staffid === staffid);
    return employee ? employee.name : "";
  };

  // const StatusList = ({ statusArray }) => {
  //   return (
  //     <div>
  //       {statusArray.map((status, index) => (
  //         <div key={index}>{status}</div>
  //       ))}
  //     </div>
  //   );
  // };

  return (
    <div className="container mx-auto px-8">
      <Header/>
      <div className="grid grid-cols-9 gap-2 border-b border-gray-300 py-8 ">
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
            className="grid grid-cols-9 gap-2 border-b border-gray-300 py-6 items-center justify-center"
            key={request.id}
          >
            <div className="col-span-1 text-center font-bold">{request.visitorname}</div>
            <div className="col-span-1 text-center">Visitor</div>
            <div className="col-span-1 text-center">{request.plannedvisittime}</div>
            <div className="col-span-1 text-center font-bold">{findEmployeeName(request.staffid)}</div>
            <div className="col-span-1 text-center">Official</div>
            <div className="col-span-1 text-center" style={{ color: request.status === 'Approved' ? 'green' : 'red' }}>{request.status}</div>
            

            {/* <div className="col-span-1 text-center" style={{color: request.hostDecision ? 'green' : 'red'}}>
              {request.hostDecision ? 'Accepted' : 'Declined'}
            </div> */}
             <div className="col-span-1 text-center">{request.statusbystaffid}</div>
             <button 
  onClick={() => handleCheckIn(request.id)}
  style={{
    backgroundColor: request.status !== 'Approved' ? 'grey' : request.statusbystaffid === 'Signed In' ? 'red' : 'green',
    padding: '10px 10px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }}
>
  {request.statusbystaffid === 'Signed In' ? 'Check out' : 'Check in'}
</button>

<HiOutlineDotsHorizontal className="cursor-pointer"/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Visitors;
