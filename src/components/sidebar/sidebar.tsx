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
import { useTranslation } from "@/src/libs/i18n";
import ProChip from "@/src/components/common/ProChip";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Sidebar = () => {
  const path = usePathname();
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsPremium(
      user?.isPremium === true ||
      user?.subscriptions?.some((s: any) => s.subscriptionStatus === "ACTIVE")
    );
  }, []);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const handleNavigation = (key: string) => {
  //   if (selectedItem !== key) {
  //     setSelectedItem(key);
  //     setIsTabChangeLoading(true);
  //   }
  // };
  const handleNavigation = (key: string) => {
    if (selectedItem !== key) {
      setSelectedItem(key);
      setIsTabChangeLoading(true);
    } else {
      // Same page — push state to trigger popstate in home.tsx
      window.history.pushState(null, '');
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("sidebarCollapsed", (!isCollapsed).toString());
  };

  const router = useRouter();

  return (
    <div
      // className={`hidden lg:flex relative h-full bg-white shadow-xl lg:shadow-none overflow-hidden
      className={`flex relative h-full bg-white overflow-hidden
  ${poppins.className} flex-col transition-all duration-500
  ${isCollapsed ? "w-[60px]" : "w-[230px]"}
`}
      style={{
        boxShadow: "0px 0px 10px 0px #0000001A inset",
      }}
    >
      {/* Logo
      <Link href="/home" className={`flex flex-col items-center`}>
        <img src="/images/appLogo.svg" alt="Loading" className="w-[90px] h-[90px]" />
        <p className="text-primary font-bold">MESTRE.IA</p>
      </Link>
      
      {isPremium && !isCollapsed && (
  <div className="flex justify-center mt-2">
    <ProChip />
  </div>
)} */}


      <Link href="/home" className={`flex flex-col items-center`}>
        <img
          src="/images/appLogo.svg"
          alt="Loading"
          className={`${isCollapsed ? "w-[50px] h-[50px]" : "w-[90px] h-[90px]"} transition-all duration-500`}
        />
        {!isCollapsed && <p className="text-primary font-bold">MESTRE.IA</p>}
      </Link>

      {isPremium && !isCollapsed && (
        <div className="flex justify-center mt-2">
          <ProChip />
        </div>
      )}

      {/* Menu */}
      {/* <div className="flex flex-col gap-1 mt-6 overflow-y-auto scrollbar-mini pb-20"> */}
      <div className="flex flex-col gap-1 mt-6 overflow-y-auto scrollbar-hide flex-1 min-h-0 pb-4">

        {menuItems.map((item) => {
          const isActive = selectedItem === item.key;
          const Icon = item.icon;
          return (
            <Tooltip
              key={item.key}
              title={isCollapsed ? item.label : ""}
              placement="right"
            >
              <img src="/images/buttonBg.svg" alt="" className="hidden" aria-hidden="true" />
              <Link
                href={item.href}
                onClick={() => {
                  handleNavigation(item.key);
                  if (selectedItem === item.key) {
                    router.push(item.href);
                  }
                }}
                className={`flex items-center cursor-pointer
                  border border-transparent hover:border-white
                  transition-all duration-10
                  gap-2 pl-8 h-[50px] relative
                  outline-none focus:outline-none
                `}
                style={isActive ? {
                  backgroundImage: "url('/images/buttonBg.svg')",
                  backgroundSize: '1200% 800%',
                  backgroundPosition: 'center',
                  boxShadow: '0px 0px 50px 0px #1953CB40',
                  border: '1px solid rgba(255,255,255,0.35)',
                  WebkitTapHighlightColor: 'transparent',

                } : { WebkitTapHighlightColor: 'transparent' }}
              >
                <img src="/images/sidebar/curv.svg" alt="Loading" width={12} height={50} className="w-[12px] h-[50px] absolute left-0" />


                <Icon
                  className={`${isActive ? "text-white" : "text-secondary"} text-xl`}
                />

                {/* {!isCollapsed && (
                  <span
                    className={`${isActive
                      ? "text-white"
                      : "text-secondary"
                      } text-[12px] truncate font-medium`}
                  >
                    {item.label}
                  </span>
                )} */}


                {!isCollapsed && (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`${isActive ? "text-white" : "text-secondary"} text-[12px] truncate font-medium`}>
                      {item.label}
                    </span>
                    {item.key === "profile"}
                  </div>
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
