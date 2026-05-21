"use client";

import React, { useEffect, useState, useRef } from "react";
import { Switch, Modal } from "antd";
import IconNotificationBell from "../icons/iconNotificationBell";
import { UserDetail } from "@/src/libs/types";
import {
  getStoredUser,
  getGreeting,
  getFocusMode,
  setFocusMode
} from "@/src/libs/helpers";
import NotificationDropdown from "@/src/modules/notification/notification";
import { useTranslation } from "@/src/libs/i18n";
import { listenForNotifications } from "@/src/libs/notificationListener";
import { getSubscription } from "@/src/services/api/subscription.api";
import { useRedirect } from "@/src/hooks/router.hooks";

const Navbar = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [greeting, setGreeting] = useState("");
  const [open, setOpen] = useState(false);
  const [focusMode, setFocusModeState] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // USER INIT
 useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setGreeting(getGreeting());
    const storedFocus = getFocusMode();
    setFocusModeState(storedFocus);
    listenForNotifications();

    const checkPremium = () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        setIsPremium(
            user?.isPremium === true ||
            user?.subscriptions?.some((s: any) => s.subscriptionStatus === "ACTIVE")
        );
    };

    checkPremium();
    const timer = setTimeout(checkPremium, 1000);
    return () => clearTimeout(timer);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // TOGGLE — check premium before allowing
  const handleFocusToggle = (value: boolean) => {
    if (value && !isPremium) {
      // User trying to turn ON but not premium
      setShowUpgradeModal(true);
      return;
    }
    setFocusModeState(value);
    setFocusMode(value);
  };

  const displayName = user?.name || user?.email?.split("@")[0] || "";

  return (
    <div className="relative w-full h-[80px] px-6 flex justify-between items-center">
      {/* LEFT SIDE */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[18px] font-medium">
          {greeting}
          {displayName === "" ? "" : ", " + displayName + "!"} 👋
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
          style={focusMode ? {
              backgroundImage: "url('/images/buttonBg.svg')",
              backgroundSize: '500% 400%',
              backgroundPosition: 'center',
              boxShadow: '0px 0px 20px 0px #1953CB40',
            } : {
              backgroundColor: '#E5E7EB',
            }}
        />

        {/* BELL */}
        <div className="cursor-pointer" onClick={() => setOpen(!open)}>
          <IconNotificationBell />
        </div>

        {/* DROPDOWN */}
        {open && <NotificationDropdown />}
      </div>

      {/* UPGRADE MODAL */}
      <Modal
        open={showUpgradeModal}
        onCancel={() => setShowUpgradeModal(false)}
        footer={null}
        centered
        width={400}
      >
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-16 h-16 flex items-center justify-center">
    <svg width="81" height="63" viewBox="0 0 81 63" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.93797 44.4392L0.0332797 12.56C-0.329533 10.2058 2.35259 8.59866 4.25803 10.0284L19.5392 21.4879C19.9364 21.7855 20.39 21.9989 20.8725 22.1153C21.355 22.2317 21.8561 22.2485 22.3452 22.1648C22.8344 22.081 23.3014 21.8984 23.7177 21.6282C24.1339 21.358 24.4908 21.0057 24.7663 20.593L37.489 1.51172C38.8327 -0.503906 41.7943 -0.503906 43.1381 1.51172L55.8607 20.593C56.1363 21.0057 56.4931 21.358 56.9094 21.6282C57.3257 21.8984 57.7926 22.081 58.2818 22.1648C58.771 22.2485 59.2721 22.2317 59.7546 22.1153C60.237 21.9989 60.6907 21.7855 61.0879 21.4879L76.369 10.0284C78.2772 8.59866 80.9566 10.2058 80.5938 12.56L75.6891 44.4392H4.93797ZM71.9992 62.1283H8.6279C8.14334 62.1283 7.66351 62.0328 7.21583 61.8474C6.76814 61.662 6.36137 61.3902 6.01872 61.0475C5.32673 60.3555 4.93797 59.417 4.93797 58.4383V50.3355H75.6891V58.4383C75.6891 60.4755 74.0363 62.1283 71.9992 62.1283Z" fill="#1B2A4A"/>
    </svg>
</div>
          <h3 className="text-[20px] font-bold text-gray-900 text-center">
            Premium Feature
          </h3>
          <p className="text-[14px] text-secondary text-center">
            Focus Mode is a premium feature. Upgrade your plan to unlock it and many more features.
          </p>
          <button
            onClick={() => {
              setShowUpgradeModal(false);
               useRedirect("/profile?open=subscription");
            }}
            // className="w-full h-[48px] bg-primary text-white rounded-[12px] text-[15px] font-semibold hover:opacity-90 transition-opacity"
            className="w-full h-[48px] text-white rounded-[12px] text-[15px] font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundImage: "url('/images/buttonBg.svg')",
              backgroundSize: '175% 700%',
              backgroundPosition: 'center',
              boxShadow: '0px 0px 50px 0px #1953CB40',
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            Upgrade To Premium
          </button>
          <button
            onClick={() => setShowUpgradeModal(false)}
            className="text-[14px] text-secondary hover:text-gray-700 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;