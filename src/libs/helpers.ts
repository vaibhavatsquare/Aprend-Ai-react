
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { app } from "../configs/firebase.config";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { removeCookie, setCookie } from "../services/coockies/coockie.service";
import { UserDetail } from "@/src/libs/types";
import { disconnectSocket } from "../socket/socket";

// Axios instance
let axiosInstance: AxiosInstance | null = null;

// Promise to wait for Firebase auth restoration
let authReadyPromise: Promise<User | null> | null = null;

// Wait for Firebase to restore the authentication state
export const waitForAuthState = (): Promise<User | null> => {
    if (!authReadyPromise) {
        authReadyPromise = new Promise((resolve) => {
            const auth = getAuth(app);
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                resolve(user); // Firebase has finished restoring the session
                unsubscribe();
                authReadyPromise = null; // Allow fresh checks on subsequent calls
            });
        });
    }

    return authReadyPromise;
};

// Create an Axios instance with valid token
const createAxiosInstance = async (): Promise<AxiosInstance> => {
    return axios.create({
        baseURL: process.env.NEXT_API_ENDPOINT || "",
    });
};

// Get the valid Firebase ID token (force refresh if necessary)
const fetchIdToken = async (): Promise<string> => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not authenticated. Please log in.");
    }

    return await user.getIdToken(false); // Force refresh the token
};

// Create or return the Axios instance
const API = async (force = false): Promise<AxiosInstance> => {
    if (axiosInstance && !force) {
        return axiosInstance;
    }

    // Wait for Firebase to restore the authentication state
    await waitForAuthState();

    // Create a new Axios instance with a valid token
    axiosInstance = await createAxiosInstance();
    return axiosInstance;
};

// API call wrapper with token refresh and retry logic
const fetch = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
        const axios = await API();
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            const idToken = await fetchIdToken();
            setCookie("idToken", idToken);
            console.log("🟢 idToken:", idToken);
            config.headers = {
                Authorization: `Bearer ${idToken}`,
            }
        }
        const response: AxiosResponse<T> = await axios.request<T>(config);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            try {
                // Handle token expiration by refreshing the token
                const newToken = await fetchIdToken();
                setCookie("idToken", newToken);
                // Update the headers with the new token
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${newToken}`,
                };

                // Retry the request with the updated token
                const axios = await API(true);
                const response: AxiosResponse<T> = await axios.request<T>(config);
                return response.data;
            } catch (refreshError: any) {
                if (refreshError?.response?.data?.message) {
                    throw new Error(refreshError.response.data.message);
                } else {
                    throw new Error("Token refresh failed.");
                }
            }
        } else {
            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error("Bad response from server");
            }
        }
    }
};

export { API, fetch };

export const getCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);

    const monday = new Date(today.setDate(diff));

    return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return d;
    });
};

export const getStoredUser = (): UserDetail | null => {
    if (typeof window === "undefined") return null;

    const user = localStorage.getItem("user");
    if (!user) return null;

    try {
        return JSON.parse(user) as UserDetail;
    } catch {
        return null;
    }
};

export const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
};

export const initializeAppLanguage = () => {
    if (typeof window === 'undefined') return;

    const { useLanguageStore } = require('@/src/store/language.store');
    const user = getStoredUser();

    // Initialize language with user preference or fallback
    useLanguageStore.getState().initializeLanguage(user?.user_language);
};

export const lightenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(2.3 * percent),
        R = (num >> 16) + amt,
        G = ((num >> 8) & 0x00ff) + amt,
        B = (num & 0x0000ff) + amt;

    return (
        "#" +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
            .toString(16)
            .slice(1)
    );
};

export const darkenColor = (hex: string, percent: number) => {
    return lightenColor(hex, -percent);
};

export const clearData = () => {
    removeCookie("idToken");
    disconnectSocket();
    localStorage.clear();
};

export const getFocusMode = () => {
    if (typeof window === "undefined") return true;

    return localStorage.getItem("focusMode") === "true";
};

export const setFocusMode = (value: boolean) => {
    localStorage.setItem("focusMode", value.toString());
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).replace(",", "   "); // extra spacing
};

export const subjects = [
    { label: "All", value: "ALL" },
    { label: "English", value: "ENGLISH" },
    { label: "Mathematics", value: "MATHEMATICS" },
    { label: "Science", value: "SCIENCE" },
    { label: "History", value: "HISTORY" },
    { label: "Geography", value: "GEOGRAPHY" },
    { label: "Computer Science", value: "COMPUTER_SCIENCE" },
    { label: "Business Economics", value: "BUSINESS_ECONOMICS" },
];

export const difficulties = [
    { label: "Easy", value: "EASY" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Hard", value: "HARD" },
    { label: "Mix", value: "MIX" },
];

export enum QuestionSource {
    HOME_PRACTICE_QUESTION = "HOME_PRACTICE_QUESTION",
    HOME_CONCEPT_EXPLANATION = "HOME_CONCEPT_EXPLANATION",
    SIMULADO = "SIMULADO",
    EXPLORE_QUESTION = "EXPLORE_QUESTION",
}