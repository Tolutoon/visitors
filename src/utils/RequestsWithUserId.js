import React from "react";
import { useParams } from "react-router-dom";
import HostRequests from "../components/cards/Host"
import TabHostRequests from "../views/Tabbar";

const RequestsWithUserId = ({userProfile}) => {
    let { userId } = useParams();
    
    // return <HostRequests hostsId={userId} />;
    return <TabHostRequests hostsId={userId} userProfile={userProfile} newRequests={"33"} />;

  }

  export default RequestsWithUserId;