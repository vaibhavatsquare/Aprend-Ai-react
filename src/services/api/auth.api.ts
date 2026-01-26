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
  return await fetch({
    url: `/auth/${sessionId}`,
    method: "PUT",
  });
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
  try {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;

    await backendLogout(sessionId);

    localStorage.clear();
    console.log("✅ Logged out");
  } catch (err) {
    console.error("❌ Logout failed:", err);
    throw err;
  }
};

/* SEND OTP */
export const sendOtp = async () => {
  return await fetch({
    url: "/auth/otp/send",
    method: "POST",
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