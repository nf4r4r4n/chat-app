import { useState, useEffect, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import Message from "./Message";
import { type Message as MessageType } from "../types/chat";

interface ChatRoomProps {
  roomName: string;
  username: string;
  onLeaveRoom: () => void;
}

export default function ChatRoom({
  roomName,
  username,
  onLeaveRoom,
}: ChatRoomProps) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    console.log("🔄 useEffect ChatRoom démarré - socket ID actuel:", socket.id);

    const handleConnect = () => {
      console.log("Join room after connection");
      socket.emit("joinRoom", { roomName, username });
    };

    if (socket.connected) socket.emit("joinRoom", { roomName, username });
    else socket.on("connect", handleConnect);

    // Écouteurs
    socket.on("roomHistory", (history: MessageType[]) => {
      console.log(`📜 Historique reçu : ${history.length} messages`);
      setMessages(history);
    });

    socket.on("newMessage", (message: MessageType) => {
      console.log("📨 Nouveau message reçu:", message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on("error", (data: any) => {
      console.error("❌ Erreur Socket:", data);
      alert(data.message);
    });

    // Si le socket est déjà connecté au moment où le composant monte
    if (socket.connected) {
      console.log("⚡ Socket déjà connecté au montage du composant");
      handleConnect();
    }

    // Nettoyage
    return () => {
      socket.off("connect", handleConnect);
      socket.off("roomHistory");
      socket.off("newMessage");
      socket.off("error");
    };
  }, [socket, roomName, username]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      roomName,
      content: newMessage.trim(),
      username,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onLeaveRoom}
            className="text-gray-400 hover:text-white"
          >
            ← Return
          </button>
          <div>
            <div className="font-semibold text-xl">#{roomName}</div>
            <div
              className={`text-xs flex items-center gap-1 ${isConnected ? "text-green-400" : "text-red-400"}`}
            >
              ● {isConnected ? "Connected" : "Disconnected"}
            </div>
          </div>
        </div>
        <div>👤 {username}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-950">
        {messages.map((msg, i) => (
          <Message
            key={msg.id || i}
            message={msg}
            isOwnMessage={msg.user.username === username}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-800 p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type message here..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-6 py-3 focus:outline-none"
            disabled={!isConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-full font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
