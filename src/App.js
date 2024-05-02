import { Routes, Route } from "react-router-dom";
// import HostRequests from './components/dashboard/HostRequests';
import RequestsWithUserId from "./components/RequestsWithUserId";
import Visitors from './components/dashboard/Visitors';


function App() {
  return (
  <Routes>
    <Route path='/' element={<Visitors/>}/>
    <Route path='/requests/:userId' element={<RequestsWithUserId />} />
    {/* <Route path='/requests' element={<HostRequests hostsId={'1234'}/>}/> */}
    {/* <Route path="/host" element={<Hosts hostId={'1234'} visitorId={'87654321'}/>}/> */}
  </Routes>
  );
}

export default App;
