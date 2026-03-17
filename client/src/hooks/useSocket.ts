import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create connection
    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected with ID:", socketRef.current?.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Cleanup
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};
