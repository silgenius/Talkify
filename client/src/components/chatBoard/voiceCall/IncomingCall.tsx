import { FiPhoneCall, FiPhoneOff } from "react-icons/fi";
import { useEffect, useRef } from "react";
import { CallDataType } from "../../../types";
import { useCall } from "../../../hooks/useCall";
import socket from "../../../socket";
import { callTimeout } from "../../../constants";

interface IncomingCallProps {
  onCallEnd: () => void;
  callData: CallDataType;
  contact: { id: string; username: string; profile_url: string };
}

const IncomingCall = ({ onCallEnd, callData, contact }: IncomingCallProps) => {
  const { acceptCall, rejectCall, setMyStream, myStream } = useCall();
  const callAudioRef = useRef<HTMLAudioElement>(null);
  const accepted = useRef(false);

  useEffect(() => {
    if (myStream && accepted.current) {
      acceptCall(callData);
      console.log(myStream);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myStream]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      socket.emit("end_call", {
        ...callData,
        dialing: false,
        endStatus: "missed",
      });
    }, callTimeout * 1000);

    if (callAudioRef.current) {
      callAudioRef.current.play();
    }

    return () => {
      clearTimeout(timeout);
      if (callAudioRef.current) {
        callAudioRef.current.pause();
        callAudioRef.current.currentTime = 0;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMyStream(stream);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
    accepted.current = true;
  };

  const handleReject = () => {
    rejectCall(callData);
    onCallEnd();
  };

  return (
    <div className="w-full text-center space-y-5">
      <audio ref={callAudioRef} src="/ringtone-126505.mp3" />
      <img
        src={contact?.profile_url || "/user.png"}
        alt=""
        className="w-16 h-16 mx-auto rounded-full object-contain object-center"
      />
      <h2 className="text-xl font-semibold">
        {contact?.username || "user"} is calling...
      </h2>
      <div className="flex justify-around">
        <button
          onClick={handleAccept}
          className="p-4 bg-emerald-500 rounded-full"
        >
          <FiPhoneCall className="text-2xl text-white" />
        </button>
        <button onClick={handleReject} className="p-4 bg-red-600 rounded-full">
          <FiPhoneOff className="text-2xl text-white" />
        </button>
      </div>
    </div>
  );
};

export default IncomingCall;
