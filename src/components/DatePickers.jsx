import React, { useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerExample = () => {
    const [selectedDate, setSelectedDate] = useState(null);
  
    return (
      <div className="w-full max-w-xs">
        <label htmlFor="datepicker" className="sr-only">
          Select Date
        </label>
        <DatePicker
          id="datepicker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText="Select Date"
          className="w-full mt-1 py-4 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>
    );
  };

  export default DatePickerExample;