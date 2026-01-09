import React from "react";
import { Button, Switch } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import IconNotificationBell from "../icons/iconNotificationBell";

const Navbar = () => {
  return (
    <div className="w-full h-[80px] px-6 flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-[18px] font-medium">Good Morning, Lucas! 👋</h1>
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
