import React, { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validPhoneNumbers, setValidPhoneNumbers] = useState([]);
  const [validNames, setValidNames] = useState([]);
  const [error, setError] = useState("");

  const phoneNumbersUrl = "http://ezapi.issl.ng:3333/employeephone";

  const [formData, setFormData] = useState({
    visitorname: "",
    visitorphone: "",
    visitoremail: "",
    plannedvisitdate: "",
    plannedvisittime: "",
    hostname: "",
    staffid: "",
    hostphoneno: "",
    hostemailaddress: "",
    hostofficeextensiom: "",
    status: "",
    statusbystaffid: ""
  });

  useEffect(() => {
    // Fetching employee phone numbers
    axios.get("http://ezapi.issl.ng:3333/employeephone")
      .then((response) => setValidPhoneNumbers(response.data.map((record) => record.phoneno)))
      .catch((err) => console.error("Error fetching phone numbers:", err));

    // Fetching employee names
    axios.get("http://ezapi.issl.ng:3333/employee")
      .then((response) => setValidNames(response.data.map((record) => record.name)))
      .catch((err) => console.error("Error fetching employee names:", err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    // setValidationErrors((prevErrors) => ({
    //   ...prevErrors,
    //   [id]: "",
    // }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const hostPhoneNo = formData.hostphoneno.toString();

    const staffIdResponse = await axios.get(`${phoneNumbersUrl}?phoneno=eq.${hostPhoneNo}`);
    console.log(staffIdResponse)
    const fetchedStaffId = staffIdResponse.data[0]?.staffid; // Use optional chaining
    if (!fetchedStaffId) {
      setError("Staff Id not found for the provided phone number");
      return;
    }

    const formattedData = {
      ...formData,
      status: "Pending",
      statusbystaffid: "Awaiting Check In",
      staffid: fetchedStaffId,
      plannedvisitdate: currentDate.toISOString().slice(0, 10),
      plannedvisittime: `${currentDate.getHours()}:${currentDate.getMinutes()}`
    };

 

    if (!validPhoneNumbers.includes(formData.hostphoneno.toString())) {
      setError("Invalid phone number provided");
      return;
    }
    if (!validNames.includes(formData.hostname)) {
      setError("Invalid name provided");
      return;
    }


  
    // Send form data to the server using Axios post request
    axios
      .post("http://ezapi.issl.ng:3333/visitationrequest", formattedData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
      .then((response) => {
        console.log("Response:", response.data);
        closeModal(); // Close modal after successful submission
      })
      .catch((error) => {
        console.error("Error:", error);
      });

      setFormData({
        visitorname: "",
        visitorphone: "",
        visitoremail: "",
        hostphoneno: "",
        hostname: "",
        hostemailaddress: "",
      });
  };
  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="py-8 pb-11 container mx-auto max-w-7xl">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">Visitor Log</h1>
        <div className="flex items-center">
          <input
            type="text"
            className="appearance-none border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
            placeholder="Search Visitor by name"
          />
          <button
            onClick={openModal}
            className="bg-black hover:bg-black-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
          >
            New Visitor
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex justify-center items-center">
          <div className="modal-overlay absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3 ">
                <p className="text-2xl font-bold">Visitation Form</p>
                <button
                  onClick={closeModal}
                  className="modal-close cursor-pointer z-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                  >
                    <path d="M6.293 6.293a1 1 0 011.414 0L9 7.586l1.293-1.293a1 1 0 111.414 1.414L10.414 9l1.293 1.293a1 1 0 01-1.414 1.414L9 10.414l-1.293 1.293a1 1 0 01-1.414-1.414L7.586 9 6.293 7.707a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
              <p className="text-l pb-3">
          Fill the details below to log your appointment
        </p>
              {/* Modal Body */}
              <div>
                <form onSubmit={handleSubmit}>
                <div className="mb-4 relative">
   <input
    className="border border-gray-300 rounded-md py-4 px-4 w-full placeholder-gray-500"
    type="text"
    id="visitorname"
    name="visitorname"
    placeholder=" "
    value={formData.visitorname}
    onChange={handleChange}
  />
  <label
    htmlFor="visitorname"
    className={`absolute left-4 transition-all duration-300 text-gray-400 ${
      formData.visitorname ? 'top-1 text-xs text-gray-600' : 'top-4 text-sm'
    }`}
  >
    Visitor's Full Name
  </label>
</div>


<div className="mb-4 relative">
  <input
    className="border border-gray-300 rounded-md py-4 px-4 w-full placeholder-gray-500"
    type="text"
    id="visitorphone"
    name="visitorphone"
    placeholder=" "
    value={formData.visitorphone}
    onChange={handleChange}
  />
  <label
    htmlFor="visitorphone"
    className={`absolute left-4 transition-all duration-300 text-gray-400 ${
      formData.visitorphone ? 'top-1 text-xs text-gray-600' : 'top-4 text-sm'
    }`}
  >
    Phone Number
  </label>
</div>

<div className="mb-4 relative">
  <input
    className="border border-gray-300 rounded-md py-4 px-4 w-full placeholder-gray-500"
    type="email"
    id="visitoremail"
    name="visitoremail"
    placeholder=" "
    value={formData.visitoremail}
    onChange={handleChange}
  />
  <label
    htmlFor="visitoremail"
    className={`absolute left-4 transition-all duration-300 text-gray-400 ${
      formData.visitoremail ? 'top-1 text-xs text-gray-600' : 'top-4 text-sm'
    }`}
  >
    Email Address
  </label>
</div>

<div className="mb-4 relative">
  <input
    className="border border-gray-300 rounded-md py-4 px-4 w-full placeholder-gray-500"
    type="text"
    id="hostname"
    name="hostname"
    placeholder=" "
    value={formData.hostname}
    onChange={handleChange}
  />
  <label
    htmlFor="hostname"
    className={`absolute left-4 transition-all duration-300 text-gray-400 ${
      formData.hostname ? 'top-1 text-xs text-gray-600' : 'top-4 text-sm'
    }`}
  >
    Who to see (Name)
  </label>
</div>

<div className="mb-4 relative">
  <input
    className="border border-gray-300 rounded-md py-4 px-4 w-full placeholder-gray-500"
    type="tel"
    id="hostphoneno"
    name="hostphoneno"
    placeholder=" "
    value={formData.hostphoneno}
    onChange={handleChange}
  />
  <label
    htmlFor="hostphoneno"
    className={`absolute left-4 transition-all duration-300 text-gray-400 ${
      formData.hostphoneno ? 'top-1 text-xs text-gray-600' : 'top-4 text-sm'
    }`}
  >
    Who to see (Phone Number)
  </label>
</div>

<div className="mb-4 relative">
  <textarea
    className="border border-gray-300 rounded-md pb-8 pt-2 px-4 w-full placeholder-gray-500"
    id="hostemailaddress"
    name="hostemailaddress"
    placeholder=" "
    value={formData.hostemailaddress}
    onChange={handleChange}
  />
  <label
    htmlFor="hostemailaddress"
    className={`absolute left-4 transition-all duration-300 text-gray-400 ${
      formData.hostemailaddress ? 'top-1 text-xs text-gray-600' : 'top-4 text-sm'
    }`}
  >
    Private Note
  </label>
</div>

                  {error && <div className="error">{error}</div>}
                  <button
                    type="submit"
                    className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-black-700 focus:outline-none focus:shadow-outline ml-auto cursor-p"
                  >
                    Submit Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End of Modal */}
    </div>
  );
};

export default Header;