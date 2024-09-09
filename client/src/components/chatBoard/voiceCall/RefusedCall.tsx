import { ReactNode } from "react";
import { RiUserVoiceLine, RiErrorWarningLine } from "react-icons/ri";
import { FiPhoneOff, FiX } from "react-icons/fi";

interface RefusedCallProps {
  status: "rejected" | "busy" | "unavailable" | "failed" | "missed";
  onClose: () => void;
}

const RefusedCall = ({ status, onClose }: RefusedCallProps) => {
  let message: ReactNode;
  let icon: ReactNode;
  let color: string;

  switch (status) {
    case "rejected":
      message = (
        <>
          <h2 className="text-xl font-semibold text-red-500">Call Rejected</h2>
          <p className="text-gray-600">
            The call was declined by the recipient.
          </p>
        </>
      );
      icon = <FiPhoneOff className="text-6xl" />;
      color = "text-red-500";
      break;

    case "busy":
      message = (
        <>
          <h2 className="text-xl font-semibold text-gray-500">User is Busy</h2>
          <p className="text-gray-600">
            The recipient is currently on another call.
          </p>
        </>
      );
      icon = <RiUserVoiceLine className="text-6xl" />;
      color = "text-gray-500";
      break;

    case "unavailable":
      message = (
        <>
          <h2 className="text-xl font-semibold text-gray-500">
            User Unavailable
          </h2>
          <p className="text-gray-600">
            The recipient is unavailable at this time.
          </p>
        </>
      );
      icon = <RiErrorWarningLine className="text-6xl" />;
      color = "text-gray-500";
      break;

    case "missed":
      message = (
        <>
          <h2 className="text-xl font-semibold text-gray-500">
            No Response
          </h2>
          <p className="text-gray-600">
            The recipient didn't respond.
          </p>
        </>
      );
      icon = <RiUserVoiceLine className="text-6xl" />;
      color = "text-yellow-500";
      break;

    case "failed":
    default:
      message = (
        <>
          <h2 className="text-xl font-semibold text-red-500">Call Failed</h2>
          <p className="text-gray-600">
            Unable to connect the call. Please try again later.
          </p>
        </>
      );
      icon = <RiErrorWarningLine className="text-6xl" />;
      color = "text-red-500";
      break;
  }

  return (
    <div className="w-full text-center space-y-5 p-6 bg-white rounded-lg">
      <div className={`flex justify-center ${color}`}>{icon}</div>
      <div>{message}</div>
      <button
        onClick={onClose}
        className="p-4 bg-gray-300 rounded-full hover:bg-gray-200 transition"
      >
        <FiX className="text-3xl text-gray-600" />
      </button>
    </div>
  );
};

export default RefusedCall;
