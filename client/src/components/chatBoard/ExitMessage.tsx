import React from "react";
import { BiExit } from "react-icons/bi";

interface ExitMessageProps {
  text: string;
}

const ExitMessage: React.FC<ExitMessageProps> = ({ text }) => {
  return (
    <div className="flex items-center justify-center p-4 rounded-lg gap-2 w-full mx-auto">

      <BiExit className="text-gray-500 text-xl" />
      <span className="text-sm font-semibold text-gray-500">{text}.</span>

    </div>
  );
};

export default ExitMessage;
