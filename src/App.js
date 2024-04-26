
import Hosts from './components/dashboard/Host';
import Visitors from './components/dashboard/Visitors';
import Header from './components/header/Header';

function App() {


  return (
    <div className='container'>
      <Header />
      <Visitors />
       <Hosts/> 
    </div>
  );
}

export default App;
