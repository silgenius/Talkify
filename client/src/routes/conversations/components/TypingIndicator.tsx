import React from "react";

interface TypingIndicatorProps {
  isTyping: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isTyping }) => {
  if (isTyping.length === 0) return null;

  const typingText =
    isTyping.length === 1
      ? `${isTyping[0]} is typing...`
      : isTyping.length === 2
      ? `${isTyping[0]} and ${isTyping[1]} are typing...`
      : `${isTyping.slice(0, 2).join(", ")} and others are typing...`;

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
