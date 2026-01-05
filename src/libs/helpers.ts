
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import { app } from "../configs/firebase.config";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { setCookie } from "../services/coockies/coockie.service";

// Axios instance
let axiosInstance: AxiosInstance | null = null;

// Promise to wait for Firebase auth restoration
let authReadyPromise: Promise<User | null> | null = null;

// Wait for Firebase to restore the authentication state
export const waitForAuthState = (): Promise<User | null> => {
    if (!authReadyPromise) {
        authReadyPromise = new Promise((resolve) => {
            const auth = getAuth(app);
            onAuthStateChanged(auth, (user) => {
                resolve(user); // Firebase has finished restoring the session
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