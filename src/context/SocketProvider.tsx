"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { initSocket, disconnectSocket } from "../socket/socket";
import { getStoredUser } from "../libs/helpers";
import ConfirmModal from "../modules/Profile/confirmModal";

const SocketContext = createContext<any>(null);

export const SocketProvider = ({ children }: any) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<any>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user?.id) {
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const socket = initSocket(userId);

    (window as any).socket = socket;

    socket.on("achievementUnlocked", (payload: any) => {
      console.log("🎉 Achievement event:", payload);

      // const data = payload.data;
       const data = payload?.data ?? payload;

  if (!data?.title) return;

      setAchievement({
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        image: data.image,
        buttonName: data.buttonName,
        code: data.code,
      });
    });

    return () => {
      socket.off("achievementUnlocked");
      disconnectSocket();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{}}>
      {children}

      {achievement && (
        <ConfirmModal
          type="achievement"
          achievement={achievement}
          onClose={() => setAchievement(null)}
        />
      )}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
