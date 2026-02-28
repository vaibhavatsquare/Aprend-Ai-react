"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authPathNames, protectedPathNames } from "@/src/libs/constants";
import ProtectedComponents from "./protectedComponents";
import PublicComponents from "./publicComponents";
import { setRouterInstance } from "@/src/hooks/router.hooks";
import { initializeAppLanguage } from "@/src/libs/helpers";

/**
 * This layout component acts as a middleware for routing logic on the client side.
 * It decides whether a route should load public UI or protected UI based on
 * authentication-related path rules.
 */
const IndexLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setRouterInstance(router);
  }, [router]);

  useEffect(() => {
    // Initialize language on app load
    initializeAppLanguage();
  }, []);

  const isAuthPath = authPathNames.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const isProtectedPath = protectedPathNames.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isAuthPath) {
    return <PublicComponents>{children}</PublicComponents>;
  }

  if (isProtectedPath) {
    return <ProtectedComponents>{children}</ProtectedComponents>;
  }

  return children;
};

export default IndexLayout;
