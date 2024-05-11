import React from "react";
import { useParams } from "react-router-dom";
import HostRequests from "./dashboard/HostRequests"
import TabHostRequests from "./dashboard/Tabbar";

const RequestsWithUserId = ({userProfile}) => {
    let { userId } = useParams();
    
    // return <HostRequests hostsId={userId} />;
    return <TabHostRequests hostsId={userId} userProfile={userProfile} />;

  }

  export default RequestsWithUserId;