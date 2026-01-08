"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext();

export const SidebarContextProvider = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isTabChangeLoading, setIsTabChangeLoading] = useState(false);

    useEffect(() => {
        const isCollapsed = localStorage.getItem("sidebarCollapsed");
        if (isCollapsed === "true") {
            setIsCollapsed(true);
        }
    }, []);

  return (
    <SidebarContext
      value={{
        isCollapsed, setIsCollapsed, isTabChangeLoading, setIsTabChangeLoading
      }}
    >
      {children}
    </SidebarContext>
  );
};

export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
