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

export const authenticateWithAPI = async () => {
  const res = await backendLogin("111");

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