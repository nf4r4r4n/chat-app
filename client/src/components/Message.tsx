import type { Message as MessageType } from "../types/chat";

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

export default function Message({ message, isOwnMessage }: MessageProps) {
  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
          isOwnMessage
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-700 text-white rounded-bl-none"
        }`}
      >
        {!isOwnMessage && (
          <div className="text-xs text-gray-400 mb-1 font-medium">
            {message.user.username}
          </div>
        )}

        <div className="text-[15px] leading-relaxed">{message.content}</div>

        <div className="text-[10px] text-gray-400 mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
