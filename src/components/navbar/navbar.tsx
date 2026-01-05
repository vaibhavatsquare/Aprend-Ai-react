import React from "react";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useState } from "react";
import LogoutModal from "../modals/logoutModal/logoutModal";

const Navbar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="w-full h-[60px] px-6 border-b flex justify-between items-center">
      <h1 className="text-[18px] font-[600]">
        APP NAME
      </h1>
      <Button
        type="primary"
        onClick={() => setIsLogoutModalOpen(true)}
        danger
        icon={<LogoutOutlined />}
      >
        Logout
      </Button>
      <LogoutModal
        isModalOpen={isLogoutModalOpen}
        setIsModalOpen={setIsLogoutModalOpen}
      />
    </div>
  );
};

export default Navbar;
