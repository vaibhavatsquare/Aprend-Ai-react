"use client";
import React, { useEffect, useRef } from "react";

interface ProChipProps {
  title?: string;
}

const ProChip = ({ title = "PRO" }: ProChipProps) => {
  return (
    <div className="relative inline-flex items-center gap-1 overflow-hidden rounded-full px-3 py-1 select-none"
      style={{
        background: "linear-gradient(135deg, rgba(221,187,69,0.2), rgba(221,187,69,0.3), rgba(221,187,69,0.5), rgba(221,187,69,0.7), rgba(221,187,69,0.8), #DDBB45)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      }}
    >
      {/* Star icon */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="#000" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>

      {/* Label */}
      <span
        className="text-[10px] font-black tracking-[1.5px] text-black"
      >
        {title}
      </span>

      {/* Shimmer overlay — slides left to right, loops every 5s */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ animation: "proShimmer 5s linear infinite" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.24) 40%, rgba(255,255,255,0.70) 50%, rgba(255,255,255,0.24) 60%, transparent 80%)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes proShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default ProChip;