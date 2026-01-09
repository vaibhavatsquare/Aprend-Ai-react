import React from "react";

const NotesIcon = ({ className }: { className?: string }) => {
  return (
    <div>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.5 10.5V13.5C5.5 17.271 5.5 19.157 6.672 20.328C7.844 21.499 9.729 21.5 13.5 21.5C17.271 21.5 19.157 21.5 20.328 20.328C21.499 19.156 21.5 17.271 21.5 13.5V10.5C21.5 6.729 21.5 4.843 20.328 3.672C19.156 2.501 17.271 2.5 13.5 2.5C9.729 2.5 7.843 2.5 6.672 3.672C5.501 4.844 5.5 6.729 5.5 10.5Z"
          stroke={className?.includes("text-white") ? "#ffffff" : "#555555"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 10.5H4C3.60218 10.5 3.22064 10.342 2.93934 10.0607C2.65804 9.77936 2.5 9.39782 2.5 9C2.5 8.60218 2.65804 8.22064 2.93934 7.93934C3.22064 7.65804 3.60218 7.5 4 7.5H7.5M5.5 17.5H4C3.60218 17.5 3.22064 17.342 2.93934 17.0607C2.65804 16.7794 2.5 16.3978 2.5 16C2.5 15.6022 2.65804 15.2206 2.93934 14.9393C3.22064 14.658 3.60218 14.5 4 14.5H7.5M11 10.5H15M11 6.5H17.5"
          stroke={className?.includes("text-white") ? "#ffffff" : "#555555"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default NotesIcon;
