import React from "react";
import { Button, Switch } from "antd";
import IconNotificationBell from "../icons/iconNotificationBell";
import { useState } from "react";
import { UserDetail } from "@/src/libs/types";
import { useEffect } from "react";
import { getStoredUser, getGreeting } from "@/src/libs/helpers";

const Navbar = () => {

  const [user, setUser] = useState<UserDetail | null>(null);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);

    setGreeting(getGreeting());
  }, []);

  const displayName =
    user?.name ||
    user?.email?.split("@")[0] ||
    "";

  return (
    <div className="w-full h-[80px] px-6 flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-[18px] font-medium">{greeting} {displayName === "" ? "" : "," + displayName + "!"} 👋</h1>
        <p className="text-xs text-secondary">
          Ready to start your learning journey today
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <Switch
          checkedChildren={<p className="font-semibold text-white">ON</p>}
          unCheckedChildren={<p className="font-semibold text-black">OFF</p>}
        />
        <IconNotificationBell />
      </div>
    </div>
  );
};

export default Navbar;
