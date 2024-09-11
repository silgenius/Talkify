import React from "react";
import { FaPhoneAlt, FaPhoneSlash, FaClock } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

interface CallMessageProps {
  duration: number; // Duration in format 'HH:MM:SS' or similar
  end_status: "r" | "m" | "a" | "f"; // Status of the call
}

const CallMessage: React.FC<CallMessageProps> = ({ duration, end_status }) => {
  // Determine styles based on end status
  const statusStyles = {
    r: {
      icon: <FaPhoneSlash className="text-red-600" />,
      text: "Call Rejected",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
    },
    m: {
      icon: <FaClock className="text-yellow-600" />,
      text: "Missed Call",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-300",
    },
    a: {
      icon: <FaPhoneAlt className="text-gray-600" />,
      text: "Call Ended",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
    },
    f: {
      icon: <MdErrorOutline className="text-red-600" />,
      text: "Call Failed",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
    },
  };

  const { icon, text, bgColor, borderColor } = statusStyles[end_status]
    ? statusStyles[end_status]
    : statusStyles.f;

  return (
    <div
      className={`flex items-center p-4 border-l-4 ${borderColor} rounded-lg shadow-lg my-3 ${bgColor} max-w-[90%]`}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0 bg-white p-2 rounded-full border border-gray-300">
        <div className="text-3xl">{icon}</div>
      </div>

      {/* Call Details */}
      <div className="ml-4 flex-1">
        <p className="text-xl font-semibold text-gray-800">{text}</p>
        {end_status === "a" && (
          <p className="text-gray-600 text-lg mt-1 text-center">{`Duration: ${duration}`}</p>
        )}
      </div>
    </div>
  );
};

export default CallMessage;
