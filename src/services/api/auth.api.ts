import { fetch } from "@/src/libs/helpers";

export const backendLogin = async (notificationToken?: string) => {
  return await fetch<{
    user: { id: string };
    userSessions: { id: string };
  }>({
    url: "/auth",
    method: "POST",
    data: { notificationToken },
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
};

/* SEND OTP */
export const sendOtp = async (email: string = "") => {
  return await fetch({
    url: "/auth/otp/send",
    method: "POST",
    data: { email },
  });
};

/* RESEND OTP */
export const resendOtp = async () => {
  return await fetch({
    url: "/auth/otp/resend",
    method: "POST",
  });
};

/* VERIFY OTP */
export const verifyOtp = async (otp: string, email: string) => {
  return await fetch<{
    token: string; // reset/set-password token
  }>({
    url: "/auth/otp/verify",
    method: "POST",
    data: { otp, email },
  });
};

/* SET PASSWORD */
export const setPassword = async (password: string, token: string) => {
  return await fetch({
    url: "/auth/set-password",
    method: "POST",
    data: { password, token },
  });
};