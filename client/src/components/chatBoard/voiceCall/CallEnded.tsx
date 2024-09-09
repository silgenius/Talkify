import React from "react";
import { FiPhoneOff, FiX } from "react-icons/fi";
import RefusedCall from "./RefusedCall";

interface CallEndedProps {
  onCallEnd: () => void;
  contact: { id: string; username: string; profile_url: string };
  status?: "rejected" | "busy" | "unavailable" | "failed" | "missed";
}

const CallEnded: React.FC<CallEndedProps> = ({
  onCallEnd,
  contact,
  status,
}) => {
  return (
    <>
      {!status ? (
        <div className="w-full text-center space-y-5">
          <img
            src={contact?.profile_url || "/user.png"}
            alt=""
            className="w-16 h-16 mx-auto rounded-full object-contain object-center"
          />
          <h2 className="text-xl font-semibold">
            Call with {contact?.username || "user"} ended
          </h2>
          <div className="flex justify-center">
            <FiPhoneOff className="text-5xl text-red-600" />
          </div>
          <button
            onClick={onCallEnd}
            className="p-4 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition duration-300"
          >
            <FiX className="text-2xl text-white" />
          </button>
        </div>
      ) : (
        <RefusedCall status={status} onClose={onCallEnd} />
      )}
    </>
  );
};

export default CallEnded;
