"use client"
import React, { useEffect, useState } from "react";
import Sidebar from "@/src/components/sidebar/sidebar";
import Navbar from "@/src/components/navbar/navbar";
import { useSidebarContext } from "@/src/context/sidebar.context";
import withAuth from "../hoc/withAuth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { GoHome } from "react-icons/go";
import { TbCards } from "react-icons/tb";
import NotesIcon from "@/src/components/icons/notesIcon";
import UserIcon from "@/src/components/icons/userIcon";

// const MobileBottomNav = () => {
//   const pathname = usePathname();
//   const selected = pathname.split("/")[1];

//   if (pathname.startsWith("/subscription")) return null;

//   const items = [
//     { key: "home", icon: GoHome, href: "/home" },
//     { key: "flashcards", icon: TbCards, href: "/flashcards" },
//     { key: "notes", icon: NotesIcon, href: "/notes" },
//     { key: "profile", icon: UserIcon, href: "/profile" },
//   ];

//   return (
//     <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50">
//       {items.map((item) => {
//         const Icon = item.icon;
//         const isActive = selected === item.key;
//         return (
//           <Link
//             key={item.key}
//             href={item.href}
//             className="flex flex-col items-center justify-center w-full h-full"
//           >
//             <Icon className={`text-2xl ${isActive ? "text-primary" : "text-secondary"}`} />
//           </Link>
//         );
//       })}
//     </div>
//   );
// };

const ProtectedComponents = ({ children }: { children: React.ReactNode }) => {
  const { isCollapsed } = useSidebarContext();
  const pathname = usePathname();
  const [userLoaded, setUserLoaded] = useState(() => {
    if (typeof window !== "undefined") {
        return !!localStorage.getItem("user");
    }
    return false;
});

useEffect(() => {
    const loadUser = async () => {
      try {
        const { getUserProfile } = await import("@/src/services/api/user.api");
        const res = await getUserProfile();
        localStorage.setItem("user", JSON.stringify(res));
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setUserLoaded(true);
      }
    };

    // If already loaded once, just fetch in background without blocking UI
    if (userLoaded) {
        loadUser();
        return;
    }

    // First load — wait for profile before showing UI
    loadUser();
}, [pathname]);

if (!userLoaded) return null;
  if (pathname.startsWith("/onboarding")) {
    return <div className="w-screen h-screen">{children}</div>;
  }

  // return (
  //   <div className="w-screen h-screen flex">
  //     <Sidebar />
  //     {/* <div
  //       className={`flex flex-col w-full transition-all duration-500 ease-in-out
  //         ${isCollapsed ? "lg:w-[calc(100vw-60px)]" : "lg:w-[calc(100vw-230px)]"}
  //       `}
  //     > */}
  //     <div className="flex flex-col flex-1 min-w-0 transition-all duration-500 ease-in-out">
  //       <Navbar />
  //       <div className="flex-1 overflow-y-auto bg-white pb-16 lg:pb-0">
  //         {children}
  //       </div>
  //     </div>
  //     <MobileBottomNav />
  //   </div>
  // );

  // After
return (
  <div className="w-screen h-screen flex">
    <Sidebar />
    <div className="flex flex-col flex-1 min-w-0 transition-all duration-500 ease-in-out">
      <Navbar />
      <div className="flex-1 overflow-y-auto bg-white">
        {children}
      </div>
    </div>
  </div>
);
};

export default withAuth(ProtectedComponents);
