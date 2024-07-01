// Dropdown.js
import React from 'react';

const Dropdown = ({ label, options, value, onChange, darkColor, darkTextColor, width, fontSize, marginLeft }) => {
  return (
    <div className={`mb-3 ${marginLeft} w-1/2`}>
      <label className="block mb-2 text-lg font-medium text-gray-900 ">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className={`shadow-sm bg-gray-50 dark:${darkColor} dark:${darkTextColor} border border-gray-300 text-gray-900 ${fontSize} rounded-lg focus:ring-blue-500 focus:border-blue-500 block ${width} p-2.5`}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
