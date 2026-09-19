import React from 'react';

const BlueDoubleTickIcon = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Left tick */}
    <path
      d="M3 13L7 17L17 7"
      stroke="#007BFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right tick, shifted slightly right for spacing */}
    <path
      d="M9 13L13 17L23 7"
      stroke="#007BFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BlueDoubleTickIcon;
