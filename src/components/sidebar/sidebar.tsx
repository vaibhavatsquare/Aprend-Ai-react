"use client";
import React, { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tooltip } from "antd";
import { useSidebarContext } from "@/src/context/sidebar.context";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import { GoHome } from "react-icons/go";
import { TbCards } from "react-icons/tb";
import NotesIcon from "../icons/notesIcon";
import UserIcon from "../icons/userIcon";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/src/libs/i18n";
import ProChip from "@/src/components/common/ProChip";
import { getUserProfile } from "@/src/services/api/user.api";
import { useSearchParams } from "next/navigation";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const Sidebar = () => {
  const path = usePathname();
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const sub = searchParams.get("subscription");
    const stripeRedirect = sessionStorage.getItem("stripeRedirect");
    if (sub === "success" || stripeRedirect) {
      if (stripeRedirect) sessionStorage.removeItem("stripeRedirect");
      getUserProfile().then((res) => {
        localStorage.setItem("user", JSON.stringify(res));
        setIsPremium(res?.isPremium === true);
      });
    } else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setIsPremium(
        user?.isPremium === true ||
        user?.subscriptions?.some((s: any) => s.subscriptionStatus === "ACTIVE")
      );
    }
  }, [searchParams]);

  const { isCollapsed, setIsCollapsed, setIsTabChangeLoading } = useSidebarContext();

  const menuItems = [
    { key: "home",      label: t('nav.home'),       icon: GoHome,    href: "/home" },
    { key: "flashcards",label: t('nav.flashcards'),  icon: TbCards,   href: "/flashcards" },
    { key: "notes",     label: t('nav.notes'),       icon: NotesIcon, href: "/notes" },
    { key: "profile",   label: t('nav.profile'),     icon: UserIcon,  href: "/profile" },
  ];

  useEffect(() => {
    const page = path.split("/")[1];
    if (page) setSelectedItem(page);
  }, [path]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (key: string) => {
    if (selectedItem !== key) {
      setSelectedItem(key);
      setIsTabChangeLoading(true);
    } else {
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
      className={`${poppins.className}`}
      style={{
        position: 'relative',
        height: '100%',
        backgroundColor: 'white',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.5s',
        boxShadow: '0px 0px 10px 0px #0000001A inset',
        // Width scales with viewport — collapsed: ~5vw, expanded: ~16vw
        width: isCollapsed
          ? 'clamp(50px, 5vw, 70px)'
          : 'clamp(160px, 16vw, 230px)',
      }}
    >
      {/* ── LOGO ── */}
      <Link href="/home" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="/images/appLogo.svg"
          alt="Loading"
          style={{
            // Logo scales with sidebar width
            width: isCollapsed ? 'clamp(36px, 4vw, 52px)' : 'clamp(60px, 7vw, 90px)',
            height: isCollapsed ? 'clamp(36px, 4vw, 52px)' : 'clamp(60px, 7vw, 90px)',
            transition: 'all 0.5s',
          }}
        />
        {!isCollapsed && (
          <p style={{
            color: '#1953CB',
            fontWeight: 700,
            fontSize: 'clamp(10px, 1.1vw, 14px)',
          }}>
            MESTRE.IA
          </p>
        )}
      </Link>

      {/* Pro chip */}
      {isPremium && !isCollapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(4px, 0.5vh, 8px)' }}>
          <ProChip />
        </div>
      )}

      {/* ── MENU ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(2px, 0.3vh, 6px)',
        marginTop: 'clamp(12px, 2vh, 24px)',
        overflowY: 'auto',
        flex: 1,
        minHeight: 0,
        paddingBottom: 'clamp(8px, 1vh, 16px)',
      }}>
        {menuItems.map((item) => {
          const isActive = selectedItem === item.key;
          const Icon = item.icon;
          return (
            <Tooltip key={item.key} title="" placement="right">
              <img src="/images/buttonBg.svg" alt="" className="hidden" aria-hidden="true" />
              <Link
                href={item.href}
                onClick={() => {
                  handleNavigation(item.key);
                  if (selectedItem === item.key) router.push(item.href);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  gap: 'clamp(4px, 0.5vw, 8px)',
                  // Height scales with viewport
                  height: 'clamp(38px, 5vh, 54px)',
                  position: 'relative',
                  outline: 'none',
                  justifyContent: isCollapsed ? 'center' : undefined,
                  paddingLeft: isCollapsed ? 'clamp(4px, 1vw, 10px)' : 'clamp(16px, 2.5vw, 32px)',
                  ...(!isCollapsed && isActive ? {
                    backgroundImage: "url('/images/buttonBg.svg')",
                    backgroundSize: '1200% 800%',
                    backgroundPosition: 'center',
                    boxShadow: '0px 0px 50px 0px #1953CB40',
                    border: '1px solid rgba(255,255,255,0.35)',
                  } : {}),
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Active indicator curve */}
                {!isCollapsed && isActive && (
                  <img
                    src="/images/sidebar/curv.svg"
                    alt=""
                    style={{
                      width: 'clamp(8px, 1vw, 12px)',
                      height: 'clamp(38px, 5vh, 54px)',
                      position: 'absolute',
                      left: 0,
                    }}
                  />
                )}

                {/* Collapsed icon */}
                {isCollapsed ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'clamp(10px, 1.2vw, 16px)',
                      width: 'clamp(32px, 3.5vw, 44px)',
                      height: 'clamp(32px, 3.5vw, 44px)',
                      flexShrink: 0,
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <img
                      src={
                        item.key === "home"
                          ? isActive ? "/images/sidebar/homeIcon.svg" : "/images/sidebar/homeIconEmpty.svg"
                          : item.key === "flashcards"
                          ? isActive ? "/images/sidebar/flashcardsIcon.svg" : "/images/sidebar/flashcardsIconEmpty.svg"
                          : item.key === "notes"
                          ? isActive ? "/images/sidebar/notesIcon.svg" : "/images/sidebar/notesIconEmpty.svg"
                          : item.key === "profile"
                          ? isActive ? "/images/sidebar/profileIcon.svg" : "/images/sidebar/profileIconEmpty.svg"
                          : undefined
                      }
                      alt={item.label}
                      style={{ width: 'clamp(18px, 2vw, 24px)', height: 'clamp(18px, 2vw, 24px)' }}
                    />
                  </div>
                ) : (
                  // Expanded icon + label
                  <>
                    <div style={{
                      fontSize: 'clamp(14px, 1.5vw, 20px)',
                      color: isActive ? 'white' : '#6B7280',
                      // Force white for custom SVG icon components that ignore color prop
                      filter: isActive ? 'brightness(0) invert(1)' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon />
                    </div>
                    <span style={{
                      color: isActive ? 'white' : '#6B7280',
                      fontSize: 'clamp(10px, 1vw, 13px)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.label}
                    </span>
                  </>
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