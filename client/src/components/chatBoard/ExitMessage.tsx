import React from 'react';
import { AiOutlineUserDelete } from 'react-icons/ai'; // Importing an icon for visual flair

interface ExitMessageProps {
  text: string;
}

const ExitMessage: React.FC<ExitMessageProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg shadow-md w-full max-w-md mx-auto mt-4">
      <AiOutlineUserDelete className="text-red-500 text-xl mr-3" />
      <span className="text-sm font-semibold">
        {text}.
      </span>
    </div>
  );
};

export default ExitMessage;
