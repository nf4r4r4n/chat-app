import { useEffect, useState } from "react";
import { type Room } from "../types/chat";
import { api } from "../services/api";

interface RoomListProps {
  username: string;
  onJoinRoom: (roomName: string) => void;
}

export default function RoomList({ username, onJoinRoom }: RoomListProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRooms = async () => {
    try {
      const data = await api.getRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error while loading rooms", err);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const createRoom = async () => {
    if (!newRoomName.trim()) return;

    setLoading(true);

    try {
      const response = await api.createRoom(newRoomName.trim());
      if (response.success) {
        setNewRoomName("");
        loadRooms(); // Refresh the list
      } else {
        alert(response.error || "Error has been occured while creating room");
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Impossible to create the room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Discussion rooms</h1>
          <div className="text-sm text-gray-400">
            Connected as <strong>{username}</strong>
          </div>
        </div>

        {/* Create a new room */}
        <div className="mb-8 bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl mb-4">Create a new room</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Nom du salon (ex: dev, fun, general)"
              className="flex-1 px-4 py-3 bg-gray-700 rounded-lg focus:outline-none"
            />
            <button
              onClick={createRoom}
              disabled={loading || !newRoomName.trim()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium disabled:bg-gray-600"
            >
              Create
            </button>
          </div>
        </div>

        {/* List of rooms */}
        <h2 className="text-xl mb-4">Available rooms</h2>
        <div className="grid gap-3">
          {rooms.length === 0 && (
            <p className="text-gray-400">There is no room for the moment...</p>
          )}

          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onJoinRoom(room.name)}
              className="bg-gray-800 hover:bg-gray-700 p-5 rounded-xl cursor-pointer transition flex justify-between items-center"
            >
              <div>
                <div className="text-xl font-semibold">#{room.name}</div>
                <div className="text-sm text-gray-400">
                  Created at{" "}
                  {new Date(room.createdAt || "").toLocaleDateString()}
                </div>
              </div>
              <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
