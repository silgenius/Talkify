import React from "react";
import { useParams } from "react-router-dom";

interface TypingIndicatorProps {
  isTyping: { username: string; conversationId: string }[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping }) => {
  const { id } = useParams();
  if (isTyping.length === 0) return null;
  const isTypingInCurrentConversation = isTyping.filter(
    (user) => user.conversationId === id
  );
  if (isTypingInCurrentConversation.length === 0) return null;

  const typingText =
    isTypingInCurrentConversation.length === 1
      ? `${isTypingInCurrentConversation[0].username} is typing...`
      : isTypingInCurrentConversation.length === 2
      ? `${isTypingInCurrentConversation[0].username} and ${isTyping[1].username} are typing...`
      : `${isTypingInCurrentConversation
          .map((user) => user.username)
          .slice(0, 2)
          .join(", ")} and others are typing...`;

  return (
    <div className="flex items-center space-x-2 mt-2 animate-pulse">
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-secondary-purple rounded-full animate-bounce" />
        <div
          className="w-1.5 h-1.5 bg-secondary-purple rounded-full animate-bounce"
          style={{ animationDelay: "100ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-secondary-purple rounded-full animate-bounce"
          style={{ animationDelay: "200ms" }}
        />
      </div>
      <p className="text-xs font-semibold text-gray-500 ">{typingText}</p>
    </div>
  );
};

export default TypingIndicator;
