import { Routes, Route } from "react-router-dom";
// import HostRequests from './components/dashboard/HostRequests';
import RequestsWithUserId from "./components/RequestsWithUserId";
import Visitors from './components/dashboard/Visitors';
import FormFloatingBasicExample from "./components/Form/VisitorsForm";
import UserLogViewer from "./components/dashboard/Log";
import LogRequestId from "./LogRequest";


function App() {
  return (
  <Routes>
    <Route path='/' element={<Visitors/>}/>
    <Route path="/form" element={<FormFloatingBasicExample/>}/>
    <Route path='/requests/:userId' element={<RequestsWithUserId />} />
    <Route path="/log/:userId" element={<LogRequestId />}/>
    {/* <Route path='/requests' element={<HostRequests hostsId={'1234'}/>}/> */}
    {/* <Route path="/host" element={<Hosts hostId={'1234'} visitorId={'87654321'}/>}/> */}
  </Routes>
  );
}

export default App;
