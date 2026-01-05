"use client"
import React, { useEffect, useState } from 'react'
import withPublic from '../hoc/withPublic';

const PublicComponents = ({ children }: { children: React.ReactNode }) => {
  const [height, setHeight] = useState("100vh");

  useEffect(() => {
    const h = window.innerHeight || "100vh";
    setHeight(`${h}px`);
  }, []);

  return (
    <div className="w-[100vw]" style={{ height }}>
      {children}
    </div>
  );
};

export default withPublic(PublicComponents);