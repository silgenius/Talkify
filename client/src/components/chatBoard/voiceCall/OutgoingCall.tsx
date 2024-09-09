import { FiPhoneOff } from "react-icons/fi";
import { MdRingVolume } from "react-icons/md";

interface DialingProps {
  onCallEnd: () => void;
  contact: { id: string; username: string; profile_url: string };
}
const OutgoingCall = ({ onCallEnd, contact }: DialingProps) => {
  return (
    <div className="w-full text-center space-y-5">
      <img
        src={contact?.profile_url || "/user.png"}
        alt=""
        className="w-16 h-16 mx-auto rounded-full object-contain object-center"
      />
      <h2 className="text-xl font-semibold">
        Calling {contact?.username || "user"}...
      </h2>
      <div className="flex justify-center">
        <MdRingVolume className="text-5xl text-secondary-purple" />
      </div>
      <button
        onClick={onCallEnd}
        className="p-4 bg-red-600 rounded-full animate-pulse"
      >
        <FiPhoneOff className="text-2xl text-white" />
      </button>
    </div>
  );
};

export default OutgoingCall;
