import React, { useState, useEffect } from "react";
import axios from "axios";

const Hosts = ({hostId, visitorId}) => {
  const [visitationRequests, setVisitationRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  // const id = 23456789;

  
  const requestBody = {
    "createdat": "now()",
    "id": visitorId,
    "visitorname": "Emily",
    "visitorphone": "string",
    "visitoremail": "string",
    "plannedvisitdate": "2024-04-27",
    "plannedvisittime": "5:10",
    "hostname": "string",
    "staffid": "1234",
    "hostphoneno": "string",
    "hostemailaddress": "string",
    "hostofficeextensiom": "string",
    "status": "Awaiting",
    "statusdate": "now()",
    "statusbystaffid": "string"
  };
  
  function submit(id, requestBody) {
    axios.patch(`http://ezapi.issl.ng:3333/visitationrequest?id=eq.${id}`, requestBody, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Patch request successful:', response.data);
    })
    .catch(error => {
      console.error('Error making patch request:', error);
    });
  }
  

  

  

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

    // Find the request object to get the updated hostDecision value
    const updatedRequestIndex = visitationRequests.findIndex((req) => req.id === id);
    if (updatedRequestIndex === -1) {
      console.error("Request with the specified ID not found.");
      return;
    }
    const updatedRequests = [...visitationRequests];
    updatedRequests[updatedRequestIndex] = { ...updatedRequests[updatedRequestIndex], hostDecision: !updatedRequests[updatedRequestIndex].hostDecision, status: "Signed In" };

    // Update state
    setVisitationRequests(updatedRequests);

    // Send PATCH request with the updated data in the request body
//     await axios.patch(`http://ezapi.issl.ng:3333/visitationrequest/${id}`, {
//       hostDecision: updatedRequests[updatedRequestIndex].hostDecision,
//       status: "Signed In"
//     });
//   } catch (error) {
//     console.error("Error updating visitation request:", error);
//   }
// };
  }

  

  // Function to find employee name by staffid
  const findEmployeeName = (staffid) => {
    const employee = employees.find((emp) => emp.staffid === staffid);
    return employee ? employee.name : "";
  };

  // Filter visitation requests based on specific staff ID
  const filteredRequests = visitationRequests.filter((request) => request.staffid === hostId);

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
            <button onClick={() => {submit(visitorId, requestBody); handleCheckIn(request.id)}}>
              {request.hostDecision ? 'Check out' : 'Check in'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hosts;
