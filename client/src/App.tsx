import { useState } from "react";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import RoomList from "./components/RoomList";

export default function App() {
  const [username, setUsername] = useState<string>("");
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const handleLoginSuccess = (user: string) => {
    setUsername(user);
  };

  const handleJoinRoom = (roomName: string) => {
    setCurrentRoom(roomName);
    setShowChat(true);
  };

  const handleLeaveRoom = () => {
    setShowChat(false);
    setCurrentRoom("");
  };

  // If not connected -> login screen
  if (!username) return <Login onLoginSuccess={handleLoginSuccess} />;

  // If in chat room
  if (showChat && currentRoom) {
    return (
      <ChatRoom
        roomName={currentRoom}
        username={username}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  // Else -> room lists
  return <RoomList username={username} onJoinRoom={handleJoinRoom} />;
}
