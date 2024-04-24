import React from "react";
import axios from "axios";

const Header = () => {
    const addUser = () => {
        axios.post('http://ezapi.issl.ng:3333/visitationrequest', {
  visitorname: 'Tolu',
  visitorphone: '08169580103',
  visitoremail: 'getolopadetolu@gmail.com',
  plannedvisitdate: '2024-04-23',
  plannedvisittime: '16:30',
  hostname: 'MD',
  staffid: '12345',
  hostphoneno: 'string',
  hostemailaddress: 'string',
  hostofficeextensiom: 'string',
  status: 'string',
  statusbystaffid: 'string'
}, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
    }
    return (
        <div className="px-10 py-8 pb-11 container mx-auto max-w-7xl"> 
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">Visitor Log</h1>
                <div className="flex items-center">
                    <input
                        type="text"
                        className="appearance-none border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                        placeholder="Search Visitor by name"
                    />
                    <button onClick={addUser} className="bg-black hover:bg-black-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2">
                        New Visitor
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header;
