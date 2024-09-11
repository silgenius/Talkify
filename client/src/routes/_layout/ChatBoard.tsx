import React, { useEffect, useRef, useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import { CallDataType, ConversationType, MessageType } from "../../types";
import { getUser } from "../../utils/localStorage";
import socket from "../../socket";
import { SocketEvent } from "../../utils/socketEvents";
import Message from "../../components/chatBoard/Message";
import ChatHeader from "../../components/chatBoard/ChatHeader";
import ChatFooter from "../../components/chatBoard/ChatFooter";
import TypingIndicator from "../../components/chatBoard/TypingIndicator";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-toastify";
import Detail from "../../components/detail/Detail";
import EmptyChat from "../../components/chatBoard/EmptyChat";
import VoiceCall from "../../components/chatBoard/VoiceCall";
import Modal from "../../components/common/Modal";
import { useCall } from "../../hooks/useCall";

type typingSocketData = {
  username: string;
  conversation_id: string;
};

const ChatBoard = () => {
  const [text, setText] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [tmpMessages, setTmpMessages] = useState<{message_text: string, status: "sending" | "failed"}[]>([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const queryClient = useQueryClient();

  //Redirect to login page if user is not logged in
  useEffect(() => {
    if (currentUser === null) {
      const timer = setTimeout(() => {
        toast.error("Please login to continue");
        navigate("/login");
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);
  // Fetch conversation data
  const conversation = useQuery<ConversationType>({
    queryKey: ["conversation", id],
    queryFn: async () => {
      const res = (await newRequest.get(`/conversation/${id}`)).data;
      console.log(res);
      return res;
    },
    enabled: !!id,
  });
  const other = conversation?.data?.users.filter(
    (user) => user.id !== currentUser.id
  )[0];

  const messages = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const res = (await newRequest.get(`/${id}/messages`)).data.messages;
      const newMessages = res.map((message: MessageType, index: number) => ({
        ...message,
        isFirst: res[index - 1]?.sender_id !== message.sender_id,
        isLast: res[index + 1]?.sender_id !== message.sender_id,
      }));
      console.log(newMessages);

      return newMessages;
    },
    enabled: !!id,
  });

  useEffect(() => {
    //scroll to the last message
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages.data, tmpMessages, isTyping]);

  useEffect(() => {
    setTmpMessages((prev) => prev.splice(0, 2));
  }, [messages.data])

  useEffect(() => {
    socket.on(
      SocketEvent.TYPING_STARTED,
      ({ username, conversation_id }: typingSocketData) => {
        // Show typing indicator in other conversation members' screens
        if (conversation_id === id && username !== currentUser.username) {
          setIsTyping((prev) =>
            !prev.includes(username) ? [...prev, username] : [...prev]
          );
        }
      }
    );
    socket.on(
      SocketEvent.TYPING_STOPPED,
      ({ username, conversation_id }: typingSocketData) => {
        // Hide typing indicator
        if (conversation_id === id && username !== currentUser.username) {
          setIsTyping((prev) => prev.filter((name) => name !== username));
        }
      }
    );

    socket.on(SocketEvent.MESSAGE_DELIVERED, (message: MessageType) => {
      if (message.conversation_id === id) {
        console.log("message delivered", message);
        queryClient.invalidateQueries({ queryKey: ["messages", id] });
        queryClient.invalidateQueries({ queryKey: ["message", message.id] });
      }
    });

    socket.on(SocketEvent.MESSAGE_READ, (message: MessageType) => {
      if (message.conversation_id === id) {
        console.log("message seen", message);
        queryClient.invalidateQueries({ queryKey: ["messages", id] });
        queryClient.invalidateQueries({ queryKey: ["message", message.id] });
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off(SocketEvent.TYPING_STARTED);
      socket.off(SocketEvent.TYPING_STOPPED);
      socket.off(SocketEvent.MESSAGE_DELIVERED);
      socket.off(SocketEvent.MESSAGE_READ);
    };
  }, [currentUser, id, queryClient]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    socket.emit(SocketEvent.START_TYPING, {
      conversation_id: id,
      sender_id: currentUser.id,
    });

    // Clear any previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(SocketEvent.STOP_TYPING, {
        conversation_id: id,
        sender_id: currentUser.id,
      });
    }, 3000);
  };

  // useEffect(() => {
  //   if (conversation.error) {
  //     if (conversation.isPlaceholderData) {
  //       toast.error("Could not load messages");
  //     } else {
  //       const error = conversation.error as AxiosError;
  //       if (error.response?.status === 404)
  //         toast.error("Conversation not found");
  //       else toast.error("Could not load conversation");
  //       //navigate("/");
  //     }
  //   }
  // }, [conversation.error, conversation.isPlaceholderData, navigate]);

  const {
    startCall,
    initiateCall,
    peer,
    remoteAudioRef,
    myStream,
    setMyStream,
  } = useCall();
  const [callData, setCallData] = useState<CallDataType>();
  const [isCall, setIsCall] = useState(false);
  const isCalling = useRef(false);

  useEffect(() => {
    if (peer) {
      socket.on("call_initiated", (data: CallDataType) => {
        if (currentUser.id === data?.callee?.userId) {
          console.log(data);
          setCallData(data);
        }
        if (
          currentUser.id === data?.caller?.userId ||
          currentUser.id === data?.callee?.userId
        )
          setIsCall(true);
      });

      if (myStream) {
        socket.on("call_accepted", (data: CallDataType) => {
          if (
            !data ||
            !data.caller ||
            !data.callee ||
            !data.callee.peerId ||
            !data.caller.peerId
          )
            return;

          if (currentUser.id === data.caller?.userId) {
            console.log(data.callee.peerId);
            startCall(data.callee.peerId, peer, myStream);
            setCallData(data);
          }
          if (currentUser.id === data.callee.userId) {
            console.log(data.caller.peerId);
            startCall(data.caller.peerId, peer, myStream);
            setCallData(data);
          }
        });
      }
    }

    socket.on("call_ended", (data: CallDataType) => {
      if (currentUser.id === data?.caller?.userId) {
        setCallData(data);
        setMyStream(undefined);
        myStream?.getTracks().forEach((track) => {
          track.stop();
        });
        peer?.off("call");
      }
      if (currentUser.id === data?.callee?.userId) {
        setIsCall(false);
        setCallData(undefined);
        peer?.off("call");
      }
    });

    return () => {
      socket.off("call_initiated");
      socket.off("call_accepted");
      socket.off("call_ended");
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peer, myStream]);

  useEffect(() => {
    if (myStream && isCalling.current && other) {
      initiateCall(setCallData, currentUser.id, other.id);
      isCalling.current = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myStream]);

  const handleCall = () => {
    setCallData((prev) => ({ ...prev, dialing: true }));
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMyStream(stream);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
    isCalling.current = true;
  };

  return (
    <div className="relative flex-1 w-full h-full">
      {
        <Modal isOpen={isCall} height="fit">
          <audio ref={remoteAudioRef} autoPlay />
          <VoiceCall
            setIsCall={setIsCall}
            contactId={
              currentUser.id === callData?.caller?.userId
                ? callData?.callee?.userId
                : callData?.caller?.userId
            }
            callData={callData}
          />
        </Modal>
      }

      {!id ? (
        <EmptyChat />
      ) : conversation.isLoading ? (
        <LoadingSpinner />
      ) : (
        conversation.data && (
          <div className="flex-1 border-r border-[#e8e2e2] h-screen flex flex-col relative">
            <ChatHeader
              conversation={conversation.data}
              setShowDetail={setShowDetail}
              startCall={handleCall}
            />
            {/* Messages Container*/}
            <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-1 pb-20 pl-16 items-start">
              {messages.data && [...messages.data,...tmpMessages].map(
                (
                  message: MessageType & { isFirst: boolean; isLast: boolean }
                ) => (
                  <Message
                    key={message.id}
                    message={message}
                    isFirst={message.isFirst}
                    isLast={message.isLast}
                    username={
                      conversation.data.users.filter(
                        (user) => user.id === message.sender_id
                      )[0]?.username
                    }
                    photoUrl={
                      conversation.data.users.filter(
                        (user) => user.id === message.sender_id
                      )[0]?.profile_url
                    }
                  />
                )
              )}
              <TypingIndicator isTyping={isTyping} />
              <div ref={lastMessageRef}></div>
            </div>
            <ChatFooter
              text={text}
              setText={setText}
              handleTyping={handleTyping}
              setTmpMessages={setTmpMessages}
              contactId={conversation.data.group? undefined : other?.id}
            />
          </div>
        )
      )}
      {showDetail && (
        <div className="w-1/4">
          <Detail />
        </div>
      )}
    </div>
  );
};

export default ChatBoard;
