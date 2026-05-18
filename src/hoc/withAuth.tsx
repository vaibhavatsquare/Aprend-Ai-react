"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearData, waitForAuthState } from "../libs/helpers";
import { auth } from "../configs/firebase.config";
import FullScreenLoader from "../components/loaders/fullScreenLoader";
import { getCookie, removeCookie } from "../services/coockies/coockie.service";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const AuthenticatedComponent = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

const checkAuthState = () => {
    const idToken = getCookie("idToken");

    // ✅ No cookie at all — redirect immediately without waiting for Firebase
    if (!idToken) {
        clearData();
        router.replace("/login");
        return;
    }

    // ✅ Firebase already has user — skip waiting
    if (auth.currentUser && idToken) {
        setLoading(false);
        return;
    }

    // ✅ Wait for Firebase to restore session
    waitForAuthState().then((user) => {
        if (!user || !idToken) {
            clearData();
            router.replace("/login");
        } else {
            setLoading(false);
        }
    });
};

useEffect(() => {
    checkAuthState();

    // ✅ When user comes back from Stripe via browser Back (bfcache restore)
    const handlePageShow = (e: PageTransitionEvent) => {
        if (e.persisted) {
            // Page restored from bfcache — re-check auth state
            checkAuthState();
        }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
}, [router]);

    if (loading) return <FullScreenLoader />;
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
