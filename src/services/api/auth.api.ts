import { fetch } from "@/src/libs/helpers";
import { UserDetail, UserSession } from "@/src/libs/types";

export const backendLogin = async (notificationToken?: string) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return await fetch<{
    user: UserDetail;
    userSessions: UserSession;
  }>({
    url: "/auth",
    method: "POST",
    data: { notificationToken,timezone },
  });
};

export const backendLogout = async (sessionId: string) => {
    try {
        return await fetch({
            url: `/auth/${sessionId}`,
            method: "PUT",
        });
    } catch {
        return null;
    }
};

export const backendDeleteUser = async () => {
    return await fetch({
        url: "/auth",
        method: "DELETE",
    });
};

export const authenticateWithAPI = async (fcmToken: any) => {
    const res = await backendLogin(fcmToken);

    localStorage.setItem("sessionId", res.userSessions.id);
    localStorage.setItem("userId", res.user.id);

    localStorage.setItem("user", JSON.stringify(res.user));
    return res;
};

export const logoutUser = async (): Promise<void> => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    try {
        await backendLogout(sessionId);
    } catch (e) {
        console.warn("Session already closed");
    }

    localStorage.removeItem("sessionId");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
};

/* SEND OTP */
export const sendOtp = async (
    email: string,
    isForgetPassword: boolean
) => {
    return await fetch({
        url: "/auth/otp/send",
        method: "POST",
        data: {
            email,
            isForgetPassword,
        },
    });
};


/* RESEND OTP */
export const resendOtp = async (email: string) => {
    return await fetch({
        url: "/auth/otp/resend",
        method: "POST",
        data: {
            email,
        },
    });
};

/* VERIFY OTP */
export const verifyOtp = async (email: string, otp: string) => {
    return await fetch<{
        data: {
            id: string;
        };
    }>({
        url: "/auth/otp/verify",
        method: "POST",
        data: { email, otp },
    });
};

/* CHANGE PASSWORD */
export const changePassword = async (payload: {
  email: string;
  password: string;
  confirmPassword: string;
  verificationId: string;
}) => {
  return await fetch({
    url: "/auth/change-password",
    method: "POST",
    data: {
      email: payload.email,
      Password: payload.password,              
      ConfirmPassword: payload.confirmPassword, 
      verificationId: payload.verificationId,
    },
  });
};