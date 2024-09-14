import Peer, { MediaConnection } from "peerjs";
import { createContext, useEffect, useRef, useState, ReactNode } from "react";
import socket from "../socket";
import { CallDataType } from "../types";

export interface CallContextType {
  remoteAudioRef: React.RefObject<HTMLAudioElement>;
  startCall: (
    remotePeerId: string,
    peer: Peer | null,
    myStream: MediaStream
  ) => void;
  acceptCall: (callData: CallDataType) => void;
  rejectCall: (callData: CallDataType) => void;
  initiateCall: (
    setCallData: React.Dispatch<React.SetStateAction<CallDataType | undefined>>,
    callerId: string,
    calleeId: string
  ) => void;
  peer: Peer | null;
  myStream: MediaStream | undefined;
  setMyStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  activeCall: MediaConnection | undefined;
}

export const CallContext = createContext<CallContextType | undefined>(
  undefined
);

export const CallProvider = ({ children }: { children: ReactNode }) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [myStream, setMyStream] = useState<MediaStream | undefined>();
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [activeCall, setActiveCall] = useState<MediaConnection>();

  useEffect(() => {
    const peerInstance = new Peer();

    peerInstance.on("open", (id) => {
      console.log("Peer ID obtained:", id);
      setPeer(peerInstance);
      console.log("PeerId", id);
    });

    return () => {
      peerInstance.disconnect();
      peerInstance.destroy(); // Clean up on component unmount
    };
  }, []);

  useEffect(() => {
    if (peer && remoteAudioRef.current && myStream) {
      peer.on("call", (incomingCall) => {
        setActiveCall(incomingCall);
        incomingCall.answer(myStream); // Answer the call with your audio stream
        incomingCall.on("stream", (remoteStream) => {
          if (remoteAudioRef.current)
            remoteAudioRef.current.srcObject = remoteStream;
        });
        incomingCall.on("close", () => {
          console.log("Incoming call ended");
          endCall();
        });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peer, myStream]);

  const startCall = (
    remotePeerId: string,
    peer: Peer | null,
    myStream: MediaStream
  ) => {
    if (peer && myStream && remoteAudioRef.current) {
      const outgoingCall = peer.call(remotePeerId, myStream);
      setActiveCall(outgoingCall);

      outgoingCall.on("stream", (remoteStream) => {
        if (remoteAudioRef.current)
          remoteAudioRef.current.srcObject = remoteStream;
      });

      outgoingCall.on("error", (err) => {
        console.error("Call error:", err);
      });

      outgoingCall.on("close", () => {
        console.log("OUTGOING call ended");
        endCall();
      });
    } else {
      if (!peer) console.error("Peer is not available");
      if (!myStream) console.error("myStream is not available");
      if (!remoteAudioRef.current)
        console.log("Audio element is not available");
    }
  };

  const acceptCall = (callData: CallDataType) => {
    socket.emit("accept_call", {
      ...callData,
      dialing: false,
      callee: { ...callData?.callee, peerId: peer?.id },
    });
  };

  const initiateCall = (
    setCallData: React.Dispatch<React.SetStateAction<CallDataType | undefined>>,
    callerId: string,
    calleeId: string
  ) => {
    if (!peer) return;

    const newCallData = {
      dialing: true,
      caller: { userId: callerId, peerId: peer.id },
      callee: { userId: calleeId },
    };
    setCallData(newCallData);
    console.log("intiate call ?");
    socket.emit("initiate_call", newCallData);
  };

  const endCall = () => {
    peer?.off("call");
    setActiveCall(undefined);
    setMyStream(undefined);

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    console.log("Call ended");
  };

  const rejectCall = (callData: CallDataType) => {
    socket.emit("end_call", {
      ...callData,
      dialing: false,
      endStatus: "rejected",
    });

    endCall();
  };

  return (
    <CallContext.Provider
      value={{
        startCall,
        acceptCall,
        rejectCall,
        initiateCall,
        setMyStream,
        remoteAudioRef,
        peer,
        myStream,
        activeCall,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};
