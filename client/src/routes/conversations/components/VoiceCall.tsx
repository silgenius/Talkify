import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { FiMic, FiMicOff, FiPhoneOff } from "react-icons/fi";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { ConversationType } from "../../../types";

interface VoiceCallProps {
  conversation: ConversationType;
  onCallEnd: () => void;
}

const VoiceCall = ({ conversation, onCallEnd }: VoiceCallProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    toast.info(isMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => !prev);
    toast.info(isSpeakerOn ? "Speaker turned off" : "Speaker turned on");
  };

  const endCall = () => {
    onCallEnd();
    toast.success("Call ended");
    // Emit an event to notify the server that the call has ended
    //socket.emit(SocketEvent.END_CALL, { conversation_id: conversation.id });
  };

  useEffect(() => {
    // Start call timer
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    // Clean up the timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const name = conversation.group
    ? conversation.name
    : conversation.users[0].username;

  return (
    <Draggable handle=".handle" bounds="parent">
      <div className="fixed z-50 p-5 bg-gray-800 text-white rounded-lg shadow-lg max-w-sm w-full">
        <div className="handle cursor-move text-center mb-5">
          <FaUserCircle className="text-6xl text-gray-400" />
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-lg mt-2">{formatTime(timeElapsed)}</p>
        </div>
        <div className="flex justify-around mb-5">
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-colors ${
              isMuted ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {isMuted ? (
              <FiMicOff className="text-2xl text-white" />
            ) : (
              <FiMic className="text-2xl text-white" />
            )}
          </button>
          <button
            onClick={toggleSpeaker}
            className={`p-4 rounded-full transition-colors ${
              isSpeakerOn ? "bg-blue-500" : "bg-yellow-500"
            }`}
          >
            {isSpeakerOn ? (
              <MdVolumeUp className="text-2xl text-white" />
            ) : (
              <MdVolumeOff className="text-2xl text-white" />
            )}
          </button>
          <button
            onClick={endCall}
            className="p-4 bg-red-600 rounded-full animate-pulse"
          >
            <FiPhoneOff className="text-2xl text-white" />
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default VoiceCall;
