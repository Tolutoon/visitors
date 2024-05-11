import React, { useState } from 'react';

const TimePicker = ({ label, onChange }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleHoursChange = (e) => {
    const value = e.target.value;
    // Ensure hours are between 0 and 23
    if (value >= 0 && value <= 23) {
      setHours(value);
      onChange(`${value}:${minutes}`);
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    // Ensure minutes are between 0 and 59
    if (value >= 0 && value <= 59) {
      setMinutes(value);
      onChange(`${hours}:${value}`);
    }
  };

  return (
    <div className="my-4 items-center">
      <label className="block text-sm font-medium text-gray-700 mr-2 pb-4">{label}</label>
      <input
        type="number"
        value={hours}
        onChange={handleHoursChange}
        placeholder="HH"
        min="0"
        max="23"
        className="w-20 px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500 mr-2"
      />
      <span className="mr-2">:</span>
      <input
        type="number"
        value={minutes}
        onChange={handleMinutesChange}
        placeholder="MM"
        min="0"
        max="59"
        className="w-[80px] px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};

export default TimePicker;
