import React from 'react';
import '../Pages/style.css'

const DotsDropdown = ({ hidden, setHidden, children }) => {
  const showDots = () => {
    setHidden(!hidden);
  };

  return (
    <div>
      <button
        id="dropdownMenuIconButton"
        onClick={() => showDots()}
        data-dropdown-toggle="dropdownDots"
        className="inline-flex items-center p-2 text-sm font-medium text-center total rounded-lg hover:bg-gray-100"
        type="button"
      >
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button>

      <div
        id="dropdownDots"
        className={`z-10 absolute top-90 left-50 ${hidden ? "hidden" : ""} bg-white divide-y divide-gray-100 rounded-lg shadow w-32`}
      >
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
          {children}
        </ul>
      </div>
    </div>
  );
};

export default DotsDropdown;
