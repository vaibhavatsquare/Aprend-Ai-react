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
  const [userLoaded, setUserLoaded] = useState(() => {
    if (typeof window !== "undefined") {
        return !!localStorage.getItem("user");
    }
    return false;
});

useEffect(() => {
    const loadUser = async () => {
      try {
        const { getUserProfile } = await import("@/src/services/api/user.api");
        const res = await getUserProfile();
        localStorage.setItem("user", JSON.stringify(res));
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setUserLoaded(true);
      }
    };

    // If already loaded once, just fetch in background without blocking UI
    if (userLoaded) {
        loadUser();
        return;
    }

    // First load — wait for profile before showing UI
    loadUser();
}, [pathname]);

if (!userLoaded) return null;
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
          className={`w-full h-[calc(100%-80px)] overflow-y-auto bg-white`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ProtectedComponents);
