"use client";

import React, { useEffect, useState, useRef } from "react";
import { Switch } from "antd";
import IconNotificationBell from "../icons/iconNotificationBell";
import { UserDetail } from "@/src/libs/types";
import { getStoredUser, getGreeting } from "@/src/libs/helpers";
import NotificationDropdown from "@/src/modules/notification/notification";

const Navbar = () => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [greeting, setGreeting] = useState("");
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setGreeting(getGreeting());
  }, []);

  // Close when click outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName =
    user?.name || user?.email?.split("@")[0] || "";

  return (
    <div className="relative w-full h-[80px] px-6 flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-[18px] font-medium">
          {greeting}
          {displayName === "" ? "" : "," + displayName + "!"} 👋
        </h1>
        <p className="text-xs text-secondary">
          Ready to start your learning journey today
        </p>
      </div>

      <div className="flex gap-3 items-center relative" ref={dropdownRef}>
        <Switch
          checkedChildren={<p className="font-semibold text-white">ON</p>}
          unCheckedChildren={<p className="font-semibold text-black">OFF</p>}
        />

        {/* 🔔 Notification Button */}
        <div
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <IconNotificationBell />
        </div>

        {/* ✅ Dropdown */}
        {open && <NotificationDropdown />}
      </div>
    </div>
  );
};

export default Navbar;
