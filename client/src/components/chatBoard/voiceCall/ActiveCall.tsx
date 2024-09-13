import { FiMic, FiMicOff, FiPhoneOff } from "react-icons/fi";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useCall } from "../../../hooks/useCall";
import socket from "../../../socket";
import { CallDataType } from "../../../types";
import { formatTime } from "../../../utils/formatTime";

interface ActiveCallProps {
  onCallEnd: () => void;
  contact: { id: string; username: string; profile_url: string };
  callData: CallDataType;
}

const ActiveCall = ({ onCallEnd, contact, callData }: ActiveCallProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);
  const { myStream, remoteAudioRef, activeCall } = useCall();

  const toggleMute = () => {
    if (myStream) {
      // Get audio tracks from the stream
      const audioTracks = myStream.getAudioTracks();

      // Toggle the enabled state of each track
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });

      // Update the isMuted state
      const newIsMuted = audioTracks.every((track) => !track.enabled);
      setIsMuted(newIsMuted);

      console.log(newIsMuted ? "Muted" : "Unmuted");

      // Optionally show a toast or notification
      // toast.info(newIsMuted ? "Microphone muted" : "Microphone unmuted");
    }
  };

  const toggleSpeaker = () => {
    // Toggle the speaker state
    setIsSpeakerOn((prev) => {
      const newSpeakerState = !prev;
      // Set the muted property of the audio element based on the new state
      if (remoteAudioRef.current) {
        remoteAudioRef.current.muted = !newSpeakerState;
      }
      console.log(newSpeakerState ? "Speaker turned on" : "Speaker turned off");
      // Optionally show a toast or notification
      // toast.info(newSpeakerState ? "Speaker turned on" : "Speaker turned off");
      return newSpeakerState;
    });
  };

  const endCall = () => {
    activeCall?.close();
    socket.emit("end_call", {
      ...callData,
      dialing: false,
      endStatus: "answered",
      duration: timeElapsed,
    });
    onCallEnd();
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

  return (
    <div className="w-full">
      <div className="handle cursor-move text-center mb-5">
        <img
          src={contact?.profile_url || "/user.png"}
          alt={contact?.username || "user"}
          className="w-16 h-16 rounded-full object-contain object-center"
        />
        <h2 className="text-xl font-semibold">{contact?.username || "user"}</h2>
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
  );
};

export default ActiveCall;
