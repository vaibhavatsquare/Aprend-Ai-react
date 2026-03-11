"use client"

import { useEffect, useRef } from "react";

export const useInitialFetch = (callback: () => void) => {

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        callback();
    }, []);
};