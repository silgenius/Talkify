import React from "react";
import { FaPhoneAlt, FaPhoneSlash, FaClock } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import formatTime from "../../utils/fomatTime";
import { GoDotFill } from "react-icons/go";

interface CallMessageProps {
  duration: number; // Duration in format 'HH:MM:SS' or similar
  end_status: "answered" | "missed" | "rejected" | "failed"; // Status of the call
  createdAt: string; // Timestamp of the call
  isSender: boolean;
}

const CallMessage: React.FC<CallMessageProps> = ({
  duration,
  end_status,
  createdAt,
}) => {
  // Determine styles based on end status
  const statusStyles = {
    rejected: {
      icon: <FaPhoneSlash className="text-red-700" />,
      text: "Call Rejected",
      bgColor: "bg-gray-100",
      borderColor: "border-red-700",
    },
    missed: {
      icon: <FaClock className="text-gray-600" />,
      text: "Missed Call",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-600",
    },
    answered: {
      icon: <FaPhoneAlt className="text-green-900" />,
      text: "Call Ended",
      bgColor: "bg-gray-100",
      borderColor: "border-primary-purple",
    },
    failed: {
      icon: <MdErrorOutline className="text-red-700" />,
      text: "Call Failed",
      bgColor: "bg-red-100",
      borderColor: "border-red-700",
    },
  };

  const { icon, text, bgColor, borderColor } = statusStyles[end_status]
    ? statusStyles[end_status]
    : statusStyles.failed;

  return (
    <div
      className={`flex items-center ${borderColor} rounded-xl shadow ${bgColor} max-w-[90%] my-0.5 p-1 px-4 space-x-3`}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0 bg-white p-2 rounded-full">
        <div className="text-2xl">{icon}</div>
      </div>

      {/* Call Details */}
      <div className="flex-1">
        <p className="text-xl font-semibold text-gray-700">{text}</p>
        <div className="flex space-x-1 justify-center items-center w-fit">
          <p className="text-gray-600 text-sm">
            {new Date(createdAt).toLocaleString("en-us", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {end_status === "answered" && (
            <>
              <GoDotFill size={5} className="text-gray-900" />
              <p className="text-green-900 text-sm">{formatTime(duration)}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallMessage;
