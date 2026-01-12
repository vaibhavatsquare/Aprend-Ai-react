import React from "react";

const IconSparkel = ({ size = 40, color = "white" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.33333 5V11.6667M5 8.33333H11.6667M10 28.3333V35M6.66667 31.6667H13.3333M21.6667 5L25.4762 16.4286L35 20L25.4762 23.5714L21.6667 35L17.8571 23.5714L8.33333 20L17.8571 16.4286L21.6667 5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconSparkel;
