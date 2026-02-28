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
import { GoHome } from "react-icons/go";
import { TbCards } from "react-icons/tb";
import NotesIcon from "../icons/notesIcon";
import UserIcon from "../icons/userIcon";
import { useRouter } from "next/navigation";
import { t } from "@/src/libs/i18n";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Sidebar = () => {
  const path = usePathname();
  const [selectedItem, setSelectedItem] = useState("");

  const { isCollapsed, setIsCollapsed, setIsTabChangeLoading } =
    useSidebarContext();

  // Menu config for future scalability - moved inside component
  const menuItems = [
    {
      key: "home",
      label: t('nav.home'),
      icon: GoHome,
      href: "/home",
    },
    {
      key: "flashcards",
      label: t('nav.flashcards'),
      icon: TbCards,
      href: "/flashcards",
    },
    {
      key: "notes",
      label: t('nav.notes'),
      icon: NotesIcon,
      href: "/notes",
    },
    {
      key: "profile",
      label: t('nav.profile'),
      icon: UserIcon,
      href: "/profile",
    },
  ];

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

  const router = useRouter();

  return (
    <div
      className={`relative h-full bg-white shadow-xl lg:shadow-none
      ${poppins.className} flex flex-col transition-all duration-500
      ${isCollapsed ? "w-[60px]" : "w-[230px]"}
    `}
      style={{
        boxShadow: "0px 0px 10px 0px #0000001A inset",
      }}
    >
      {/* Logo */}
      <Link href="/home" className={`flex flex-col items-center`}>
        <Image src="/images/appLogo.svg" alt="Loading" width={90} height={90} />
        <p className="text-primary font-bold">MESTRE.IA</p>
      </Link>

      {/* Menu */}
      <div className="flex flex-col gap-1 mt-10 overflow-y-auto scrollbar-mini pb-20">
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
                className={`flex items-center cursor-pointer
                  border border-transparent hover:border-white
                  transition-all duration-300
                  gap-2 pl-8 h-[50px] relative
                  ${isActive ? "bg-primary" : ""}
                `}
              >
                <Image src="/images/sidebar/curv.svg" alt="Loading" width={12} height={50} className="absolute left-0" />

                <Icon
                  className={`${isActive ? "text-white" : "text-secondary"} text-xl`}
                />

                {!isCollapsed && (
                  <span
                    className={`${isActive
                      ? "text-white"
                      : "text-secondary"
                      } text-[12px] truncate font-medium`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
