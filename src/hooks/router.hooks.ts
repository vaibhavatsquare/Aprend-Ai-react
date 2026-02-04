"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Global variable to hold router instance,
 * since we can't call useRouter outside components.
 */
let routerInstance: ReturnType<typeof useRouter> | null = null;

/**
 * Stores the router instance from a React component
 * so we can use routing functionality anywhere in the app.
 *
 * @param router - Instance of useRouter() coming from a client component
 */
export const setRouterInstance = (router: ReturnType<typeof useRouter>) => {
  routerInstance = router;
};

let lastNavigationWasReplace = false;

export const canGoBack = () => {
  if (lastNavigationWasReplace) return false;
  return window.history.length > 1;
};

/**
 * Utility function to redirect the user to a specific URL.
 * Falls back to window.location if router is not yet initialized.
 *
 * @param path - The path or URL to navigate to
 * @param replace - Whether to replace history instead of pushing a new entry
 */
export const useRedirect = (path: string, replace: boolean = false) => {
  lastNavigationWasReplace = replace;
  
  if (routerInstance) {
    replace ? routerInstance.replace(path) : routerInstance.push(path);
  } else {
    console.warn("Router not initialized — using window.location fallback");

    replace ? window.location.replace(path) : (window.location.href = path);
  }
};

/**
 * Update or remove query/search parameters in the URL.
 * Does not trigger a full page reload thanks to router.replace().
 *
 * @param key - Search query key
 * @param value - New value. If empty/null/undefined → parameter removed
 */
export const setSearchParam = (
  key: string,
  value?: string | number | null
) => {
  if (!routerInstance)
    return console.warn("Router not initialized");

  // Clone current URL
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  // If no valid value is provided → remove the param
  if (value === undefined || value === null || value === "") {
    searchParams.delete(key);
  } else {
    searchParams.set(key, String(value));
  }

  // Update the URL without page reload
  routerInstance.replace(`${url.pathname}?${searchParams.toString()}`);
};

/**
 * Navigates back in browser history safely.
 * Uses router.back() when available, fallback to window.history.
 */
export const useBack = () => {
  if (routerInstance) {
    routerInstance.back();
  } else if (window.history.length > 1) {
    window.history.back();
  } else {
    // (Optional) Define a fallback route if there's no history available
    // window.location.href = "/";
  }
};
