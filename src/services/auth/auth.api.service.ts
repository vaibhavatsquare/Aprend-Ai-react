import { fetch as axiosFetch } from "@/src/libs/helpers";
import { response } from "@/src/libs/types";

export interface loginPayload {
    ipAddress?: string;
}

export const getDeviceIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data?.ip
    } catch (error) {
        return false
    }
}

export const authenticateWithAPI = async (payload: loginPayload): Promise<any> => {
    return await axiosFetch({
        url: `/auth/login`,
        method: "POST",
        data: payload,
    });
};

export const logoutUser = async (): Promise<any> => {

    const sessionId = localStorage.getItem("sessionId")

    return await axiosFetch({
        url: `/auth/${sessionId}/logout`,
        method: "POST"
    });
};

export const getCurrentUserProfile = async (): Promise<any> => {

    const adminUserId = localStorage.getItem("userId")
    const res: response = await axiosFetch({
        url: `/user/${adminUserId}/profile`,
        method: "GET"
    });
    return res.data;
};