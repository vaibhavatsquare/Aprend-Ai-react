import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
            transports: ["websocket"],
            query: {
                userId: userId
            }
        });

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket?.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ Socket disconnected:", reason);
        });

        socket.on("reconnect", () => {
            console.log("♻️ Socket reconnected");
        });

        socket.on("connect_error", (err) => {
            console.log("⚠️ Socket error:", err.message);
        });
    }

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
};