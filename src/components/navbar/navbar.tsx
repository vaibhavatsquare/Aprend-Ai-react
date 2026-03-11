"use client";

import React, { useEffect, useState, useRef } from "react";
import { Switch } from "antd";
import IconNotificationBell from "../icons/iconNotificationBell";
import { UserDetail } from "@/src/libs/types";
import {
  getStoredUser,
  getGreeting,
  getFocusMode,
  setFocusMode
} from "@/src/libs/helpers";
import NotificationDropdown from "@/src/modules/notification/notification";
import { t } from "@/src/libs/i18n";
import { listenForNotifications } from "@/src/libs/notificationListener";

const Navbar = () => {

  const [user, setUser] = useState<UserDetail | null>(null);
  const [greeting, setGreeting] = useState("");
  const [open, setOpen] = useState(false);
  const [focusMode, setFocusModeState] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // USER INIT
  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);

    setGreeting(getGreeting());

    const storedFocus = getFocusMode();
    setFocusModeState(storedFocus);
    listenForNotifications();
  }, []);

  // CLICK OUTSIDE
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

  // TOGGLE
  const handleFocusToggle = (value: boolean) => {
    setFocusModeState(value);
    setFocusMode(value);
  };

  const displayName =
    user?.name || user?.email?.split("@")[0] || "";

  return (
    <div className="relative w-full h-[80px] px-6 flex justify-between items-center">
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-1">

        <h1 className="text-[18px] font-medium">
          {greeting}
          {displayName === "" ? "" : "," + displayName + "!"} 👋
        </h1>

        <p className="text-xs text-secondary">
          {t("home.readyToStart")}
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex gap-3 items-center relative" ref={dropdownRef}>

        {/* FOCUS MODE */}
        <Switch
          checked={focusMode}
          onChange={handleFocusToggle}
          checkedChildren={
            <p className="font-semibold text-white">ON</p>
          }
          unCheckedChildren={
            <p className="font-semibold text-black">OFF</p>
          }
        />

        {/* BELL */}
        <div
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <IconNotificationBell />
        </div>

        {/* DROPDOWN */}
        {open && <NotificationDropdown />}

      </div>

    </div>
  );

};

export default Navbar;