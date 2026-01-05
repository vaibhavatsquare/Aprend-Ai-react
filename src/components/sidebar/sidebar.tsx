"use client";
import React, { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tooltip } from "antd";
import { useSidebarContext } from "@/src/context/sidebar.context";
import { UserOutlined } from "@ant-design/icons";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

// Menu config for future scalability
const menuItems = [
  {
    key: "home",
    label: "Home",
    icon: UserOutlined,
    href: "/home",
  },
];

const Sidebar = () => {
  const path = usePathname();
  const [selectedItem, setSelectedItem] = useState("");

  const { isCollapsed, setIsCollapsed, setIsTabChangeLoading } =
    useSidebarContext();

  useEffect(() => {
    const page = path.split("/")[1];
    if (page) setSelectedItem(page);
  }, [path]);

  const handleNavigation = (key: string) => {
    if (selectedItem !== key) {
      setSelectedItem(key);
      setIsTabChangeLoading(true);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("sidebarCollapsed", (!isCollapsed).toString());
  };

  return (
    <div
      className={`relative h-full bg-white border-r border-[#e0e0e0] shadow-xl lg:shadow-none
      ${poppins.className} flex flex-col transition-all duration-500
      ${isCollapsed ? "w-[60px]" : "w-[230px]"}
    `}
    >
      {/* Logo */}
      <Link href="/home" className={`flex justify-center items-center mt-4`}>
        <Image
          src="" // Add your logo path here and adjust size as needed
          alt="Logo"
          width={150}
          height={150}
          className={`${
            isCollapsed ? "w-[30px]" : "w-[120px]"
          } h-[30px] border`}
        />
      </Link>

      {/* Menu */}
      <div className="flex flex-col gap-1 mt-10 px-1.5 overflow-y-auto scrollbar-mini pb-20">
        {menuItems.map((item) => {
          const isActive = selectedItem === item.key;
          const Icon = item.icon;
          return (
            <Tooltip
              key={item.key}
              title={isCollapsed ? item.label : ""}
              placement="right"
            >
              <Link
                href={item.href}
                onClick={() => handleNavigation(item.key)}
                className={`flex items-center cursor-pointer rounded-md
                  border border-transparent hover:border-white
                  transition-all duration-300
                  ${
                    isCollapsed ? "justify-center px-0 py-2" : "gap-2 px-3 py-2"
                  }
                  ${isActive ? "bg-[#006aff]" : ""}
                `}
              >
                <Icon
                  className={`${isActive ? "text-white" : "text-[#006aff]"}`}
                />

                {!isCollapsed && (
                  <span
                    className={`${
                      isActive
                        ? "text-white font-semibold"
                        : "text-[#006aff] font-medium"
                    } text-[12px] truncate`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            </Tooltip>
          );
        })}
      </div>

      {/* Toggle Button */}
      <div className="absolute bottom-0 flex justify-center items-center p-1.5 w-full cursor-pointer">
        <button
          onClick={toggleSidebar}
          className="w-full h-full flex justify-center items-center py-2 bg-[#006aff] rounded-md"
        >
          <Tooltip title="Toggle Sidebar" placement="right">
            {isCollapsed ? (
              <FaChevronRight className="text-[#ffffff]" />
            ) : (
              <FaChevronLeft className="text-[#ffffff]" />
            )}
          </Tooltip>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
