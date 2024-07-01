import React from 'react';

const PopUp = ({ trigger, setTrigger, children, width, maxWidth, minHeight }) => {
  return trigger ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg px-16 py-6 shadow-lg ${width} ${maxWidth} ${minHeight} overflow-y-auto max-h-full custom-scrollbar`}>
        <button
          className="absolute top-2 right-2 text-xl text-gray-600"
          onClick={() => setTrigger(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  ) : null;
};

export default PopUp;
