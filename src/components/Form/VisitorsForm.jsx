import React, { useState, useEffect } from "react";
import axios from "axios";
import { useMask } from "@react-input/mask";

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
  const [phoneMask, setPhoneMask] = useState("+234 (___) ___-____");
  const [validNames, setValidNames] = useState([]);
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
    if (!validPhoneNumbers.includes(hostPhoneNo)) {
      setError("Invalid phone number provided");
      return;
    }
    if (!validNames.includes(formData.hostname)) {
      setError("Invalid name provided");
      return;
    }

    try {
      const staffIdResponse = await axios.get(`${phoneNumbersUrl}?phoneno=eq.${hostPhoneNo}`);
      const fetchedStaffId = staffIdResponse.data[0]?.staffid;
      if (!fetchedStaffId) {
        setError("Staff Id not found for the provided phone number");
        return;
      }

      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

      const defaultFormData = {
        ...formData,
        status: "Pending",
        statusbystaffid: "Awaiting Check In",
        staffid: fetchedStaffId,
        plannedvisittime: currentTime,
      };

      await axios.post(visitationRequest, defaultFormData);
      console.log("Form data submitted successfully");

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
      setPhoneMask("+234 (___) ___-____");
    } else {
      // Default mask
      setPhoneMask("+234 (___) ___-____");
    }
  }, [formData.visitorphone]);

  const phoneNumberRef = useMask({
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
    className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer"
    placeholder=" "
  />
  <label
    htmlFor="floating_filled"
    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
  >
    Visitor's Full Name
  </label>
</div>
        {/* <div>
          <input
            type="text"
            id="visitorname"
            placeholder="Visitor's Full Name"
            value={formData.visitorname}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {validationErrors.visitorname && <div className="text-red-500">{validationErrors.visitorname}</div>}
        </div> */}
        {/* <div>
          <input
            type="tel"
            id="visitorphone"
            placeholder="Phone Number"
            value={formData.visitorphone}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {validationErrors.visitorphone && <div className="text-red-500">{validationErrors.visitorphone}</div>}
        </div> */}
  <div className="relative">
  <input
    type="text"
    ref={phoneNumberRef}
    id="visitorphone"
    value={formData.visitorphone}
    onChange={handleChange}
    className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer"
    placeholder=" "
  />
  <label
    htmlFor="floating_filled"
    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
  >
    Phone Number
  </label>
</div>
        {/* <div>
          <input
            type="email"
            id="visitoremail"
            placeholder="Email Address"
            value={formData.visitoremail}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {validationErrors.visitoremail && <div className="text-red-500">{validationErrors.visitoremail}</div>}
        </div> */}
              <div className="relative">
  <input
    type="text"
    id="visitoremail"
    value={formData.visitoremail}
    onChange={handleChange}
    className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer"
    placeholder=" "
  />
  <label
    htmlFor="floating_filled"
    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
  >
    Email Address
  </label>
</div>
        {/* <div>
          <input 
            type="tel"
            id="hostphoneno"
            placeholder="Who to See (Phone Number)"
            value={formData.hostphoneno}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {validationErrors.hostphoneno && <div className="text-red-500">{validationErrors.hostphoneno}</div>}
        </div> */}
  <div className="relative">
  <input
    type="tel"
    id="hostphoneno"
    value={formData.hostphoneno}
    onChange={handleChange}
    className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer"
    placeholder=" "
  />
  <label
    htmlFor="floating_filled"
    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
  >
    Who to See (Phone Number)
  </label>
</div>
        {/* <div>
          <input
            type="text"
            id="hostname"
            placeholder="Who to see (Name)"
            value={formData.hostname}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {validationErrors.hostname && <div className="text-red-500">{validationErrors.hostname}</div>}
        </div> */}
          <div className="relative">
  <input
    type="text"
    id="hostname"
    value={formData.hostname}
    onChange={handleChange}
    className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer"
    placeholder=" "
  />
  <label
    htmlFor="floating_filled"
    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
  >
    Who to See (Name)
  </label>
</div>
        {/* <div>
          <textarea
            id="hostemailaddress"
            placeholder="Leave a note here"
            rows="4"
            value={formData.hostemailaddress}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-md"
          />
          {validationErrors.hostemailaddress && <div className="text-red-500">{validationErrors.hostemailaddress}</div>}
        </div> */}
          <div className="relative">
  <textarea
    id="hostemailaddress"
    rows="4"
    value={formData.hostemailaddress}
    onChange={handleChange}
    className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-transparent border border-gray-300 border-b-2 appearance-none focus:outline-none focus:border-blue-600 peer"
    placeholder=" "
  />
  <label
    htmlFor="floating_filled"
    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
  >
   Notes
  </label>
</div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end">
          <button type="submit" id="btn" className="w-60 bg-black text-white py-4 rounded-md">Submit Request</button>
        </div>
      </form>
    </div>
  );
};

export default FormFloatingBasicExample;
