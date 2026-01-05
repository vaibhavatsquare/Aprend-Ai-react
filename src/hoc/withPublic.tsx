"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { waitForAuthState } from "../libs/helpers";
import { auth } from "../configs/firebase.config";
import FullScreenLoader from "../components/loaders/fullScreenLoader";
import { getCookie, removeCookie } from "../services/coockies/coockie.service";

function withPublic<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const PublicComponent = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const checkAuthState = () => {
      const idToken = getCookie("idToken");
      waitForAuthState().then((user) => {
        if (user && idToken) {
          router.replace("/home"); // Replace with your protected home route
        } else {
          removeCookie("idToken");
          localStorage.clear();
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

  return PublicComponent;
}

export default withPublic;
