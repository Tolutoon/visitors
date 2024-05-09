import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useMask } from "@react-input/mask";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
// import { ImCheckboxChecked } from "react-icons/im";
import { ToastContainer, toast } from "react-toastify";

// Modal component
const Modal = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center h-screen my-10">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full mx-4">
              <div className="flex items-center justify-center pt-4">
                <IoCheckmarkDoneCircleSharp className="text-8xl text-green-500" />
              </div>
              <div className="bg-white p-4 flex flex-col items-center justify-center">
                <h2 className="font-bold text-xl mb-4">Request submitted successfully</h2>
                <p className="mb-8 text-center">Your request has been submitted. Please wait while your request is being processed.</p>
                <Link
                  to="/"
                  className="block text-center bg-black text-white px-8 py-2 rounded-md hover:bg-opacity-80"
                  onClick={onClose}
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const FormFloatingBasicExample = () => {
  const [formData, setFormData] = useState({
    visitorname: "",
    visitorphone: "",
    visitoremail: "",
    hostphoneno: "",
    hostname: "",
    hostemailaddress: "",
    plannedvisittime: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [validPhoneNumbers, setValidPhoneNumbers] = useState([]);
  const [phoneMask, setPhoneMask] = useState("___________"); 
  const [validNames, setValidNames] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal

  const apiUrl = "http://ezapi.issl.ng:3333/employee";
  const phoneNumbersUrl = "http://ezapi.issl.ng:3333/employeephone";
  const visitationRequest = "http://ezapi.issl.ng:3333/visitationrequest";

  useEffect(() => {
    axios.get(phoneNumbersUrl)
      .then((response) => setValidPhoneNumbers(response.data.map((record) => record.phoneno)))
      .catch((err) => console.error("Error fetching phone numbers:", err));

    axios.get(apiUrl)
      .then((response) => setValidNames(response.data.map((record) => record.name)))
      .catch((err) => console.error("Error fetching employee names:", err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let convertedValue = value;
    if (id === "visitorphone" || id === "hostphoneno") {
      convertedValue = value.toString();
    }
    setFormData((prevData) => ({
      ...prevData,
      [id]: convertedValue,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    for (const key in formData) {
      if (formData[key] === "") {
        errors[key] = "Please fill out this field";
      }
    }
    setValidationErrors(errors);

    const hostPhoneNo = formData.hostphoneno.toString();
    const cleanedPhoneNumber = hostPhoneNo.replace(/\D/g, "");

    if (!validPhoneNumbers.includes(cleanedPhoneNumber)) {
      const notify = () => toast.warn("Invalid Phone Number Provided")
      notify()
      // setError("Invalid phone number provided");
      return;
    }
    if (!validNames.includes(formData.hostname)) {
      // setError("Invalid name provided");
      const notify = () => toast.warn("Invalid name provided")
      notify()
      return;
    }

    try {
      // Your submission logic here...
      const staffIdResponse = await axios.get(`${phoneNumbersUrl}?phoneno=eq.${cleanedPhoneNumber}`);
      console.log(staffIdResponse);
      const fetchedStaffId = staffIdResponse.data[0]?.staffid;
      if (!fetchedStaffId) {
        setError("Staff Id not found for the provided phone number");
        return;
      }

      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

      const defaultFormData = {
        ...formData,
        hostphoneno: cleanedPhoneNumber,
        status: "Pending",
        statusbystaffid: "Awaiting Check-In",
        staffid: fetchedStaffId,
        plannedvisittime: currentTime,
      };

      await axios.post(visitationRequest, defaultFormData);
      console.log("Form data submitted successfully");

      // Show modal on successful submission
      setShowModal(true);

      // Reset form data, error, and validation errors
      setFormData({
        visitorname: "",
        visitorphone: "",
        visitoremail: "",
        hostphoneno: "",
        hostname: "",
        hostemailaddress: "",
      });
      setError("");
      setValidationErrors({});
    } catch (error) {
      console.error("Error submitting form data:", error.message);
      setError("Failed to submit form data");
    }
  };

  useEffect(() => {
    if (formData.visitorphone.startsWith("+234")) {
      // Set mask for Nigeria
      setPhoneMask("___________");
    } else {
      // Default mask
      setPhoneMask("___________");
    }
  }, [formData.visitorphone]);

  const phoneNumberRef = useMask({
    mask: phoneMask,
    replacement: { _: /\d/ },
  });

  const whoToSeePhoneNumberRef = useMask({
    mask: phoneMask,
    replacement: { _: /\d/ },
  });

  return (
    <div className="container mx-auto py-12 px-6 sm:w-1/2">
      <h2 className="text-3xl font-bold mb-4">Visitation Form</h2>
      <p className="text-gray-600 mb-8">Fill the details below to log your appointment</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            id="visitorname"
            value={formData.visitorname}
            onChange={handleChange}
            className={`block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer ${validationErrors.visitorname ? 'border-red-500' : ''}`}
            placeholder=" "
          />
          <label
            htmlFor="visitorname"
            className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${formData.visitorname ? 'text-black' : ''}`}
          >
            Visitor's Full Name
          </label>
          {validationErrors.visitorname && <div className="text-red-500">{validationErrors.visitorname}</div>}
        </div>
        
        <div className="relative">
          <input
            type="text"
            ref={phoneNumberRef}
            id="visitorphone"
            value={formData.visitorphone}
            onChange={handleChange}
            className={`block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer ${validationErrors.visitorphone ? 'border-red-500' : ''}`}
            placeholder=" "
          />
          <label
            htmlFor="visitorphone"
            className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${formData.visitorphone ? 'text-black' : ''}`}
          >
            Phone Number
          </label>
          {validationErrors.visitorphone && <div className="text-red-500">{validationErrors.visitorphone}</div>}
        </div>
        
        <div className="relative">
          <input
            type="text"
            id="visitoremail"
            value={formData.visitoremail}
            onChange={handleChange}
            className={`block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer ${validationErrors.visitoremail ? 'border-red-500' : ''}`}
            placeholder=" "
          />
          <label
            htmlFor="visitoremail"
            className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${formData.visitoremail ? 'text-black' : ''}`}
          >
            Email Address
          </label>
          {validationErrors.visitoremail && <div className="text-red-500">{validationErrors.visitoremail}</div>}
        </div>
        
        <div className="relative">
          <input
            ref={whoToSeePhoneNumberRef}
            type="tel"
            id="hostphoneno"
            value={formData.hostphoneno}
            onChange={handleChange}
            className={`block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer ${validationErrors.hostphoneno ? 'border-red-500' : ''}`}
            placeholder=" "
          />
          <label
            htmlFor="hostphoneno"
            className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${formData.hostphoneno ? 'text-black' : ''}`}
          >
            Who to See (Phone Number)
          </label>
          {validationErrors.hostphoneno && <div className="text-red-500">{validationErrors.hostphoneno}</div>}
        </div>
        
        <div className="relative">
          <input
            type="text"
            id="hostname"
            value={formData.hostname}
            onChange={handleChange}
            className={`block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer ${validationErrors.hostname ? 'border-red-500' : ''}`}
            placeholder=" "
          />
          <label
            htmlFor="hostname"
            className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${formData.hostname ? 'text-black' : ''}`}
          >
            Who to See (Name)
          </label>
          {validationErrors.hostname && <div className="text-red-500">{validationErrors.hostname}</div>}
        </div>
        
        <div className="relative">
          <textarea
            id="hostemailaddress"
            rows="4"
            value={formData.hostemailaddress}
            onChange={handleChange}
            className={`block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer ${validationErrors.hostemailaddress ? 'border-red-500' : ''}`}
            placeholder=" "
          />
          <label
            htmlFor="hostemailaddress"
            className={`absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 ${formData.hostemailaddress ? 'text-black' : ''}`}
          >
            Notes
          </label>
          {validationErrors.hostemailaddress && <div className="text-red-500">{validationErrors.hostemailaddress}</div>}
        </div>
        
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end">
          <button type="submit" id="btn" className="w-60 bg-black text-white py-4 rounded-md">Submit Request</button>
        </div>
        <ToastContainer />
      </form>

      {/* Render modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default FormFloatingBasicExample;
