"use client"
import React, { useEffect, useState } from "react";
import Sidebar from "@/src/components/sidebar/sidebar";
import Navbar from "@/src/components/navbar/navbar";
import { useSidebarContext } from "@/src/context/sidebar.context";
import withAuth from "../hoc/withAuth";
import { usePathname } from "next/navigation";

const ProtectedComponents = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed } = useSidebarContext();
  const pathname = usePathname();

  if (pathname.startsWith("/onboarding")) {
    return <div className="w-screen h-screen">{children}</div>;
  }

  return (
    <div className="w-screen h-screen flex">
      <Sidebar />
      <div
        className={`${
          isCollapsed ? "w-[calc(100vw-60px)]" : "w-[calc(100vw-230px)]"
        } transition-all duration-500 ease-in-out`}
      >
        <Navbar />
        <div
          className={`w-full h-[calc(100%-60px)] overflow-y-auto bg-gray-100`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ProtectedComponents);
