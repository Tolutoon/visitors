import React from "react";
import { useParams } from "react-router-dom";
import HostRequests from "./dashboard/HostRequests"

const RequestsWithUserId = () => {
    let { userId } = useParams();
    
    return <HostRequests hostsId={userId} />;
  }

  export default RequestsWithUserId;