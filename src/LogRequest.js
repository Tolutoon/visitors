import React from "react";
import { useParams } from "react-router-dom";
import UserLogViewer from "./components/cards/Log";

const LogRequestId = () => {
    let { userId } = useParams();   

    return < UserLogViewer requestId={userId} />;
  }

  export default LogRequestId;