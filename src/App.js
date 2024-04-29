import { Routes, Route } from "react-router-dom";
import Hosts from './components/dashboard/Host';
import HostRequests from './components/dashboard/HostRequests';
import Visitors from './components/dashboard/Visitors';
import Header from './components/header/Header';
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"/>

function App() {


  return (
  //   <div className='container'>
  //     {/* <Header />
  //     <Visitors />
  //     <Hosts hostId={'1234'}/>
  // <Hosts hostId={'34567'}/> */}
  //      <HostRequests/> 
  //   </div>
  <Routes>
    <Route path='/' element={<Visitors/>}/>
    <Route path='/requests' element={<HostRequests/>}/>
    <Route path="/host" element={<Hosts hostId={'1234'} visitorId={'87654321'}/>}/>
  </Routes>
  );
}

export default App;
