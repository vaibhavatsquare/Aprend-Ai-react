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

    // If already authenticated, skip loader
    if (auth.currentUser && idToken) {
        setLoading(false);
        return;
    }

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
    }, [router]);

    if (loading) return <FullScreenLoader />;
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
