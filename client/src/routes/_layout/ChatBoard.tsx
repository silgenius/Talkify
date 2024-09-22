import React, { useEffect, useRef, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import { CallDataType, ConversationType, MessageType, UserType } from "../../types";
import { getUser } from "../../utils/localStorage";
import socket from "../../socket";
import { SocketEvent } from "../../utils/socketEvents";
import Message from "../../components/chatBoard/Message";
import ChatHeader from "../../components/chatBoard/ChatHeader";
import ChatFooter from "../../components/chatBoard/ChatFooter";
import TypingIndicator from "../../components/chatBoard/TypingIndicator";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-toastify";
import Detail from "../../components/chatBoard/Detail";
import EmptyChat from "../../components/chatBoard/EmptyChat";
import VoiceCall from "../../components/chatBoard/VoiceCall";
import Modal from "../../components/common/Modal";
import { useCall } from "../../hooks/useCall";
import { formatTime } from "../../utils/formatTime";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { getChatOthers } from "../../utils/conversationData";

type typingSocketData = {
  user_id: string,
  username: string;
  conversation_id: string;
};

const ChatBoard = () => {
  const [text, setText] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [isTyping, setIsTyping] = useState<
    { username: string; conversationId: string }[]
  >([]);
  const [tmpMessages, setTmpMessages] = useState<
    {
      messageId: number;
      message_text: string;
      status: "sending" | "failed" | "sent";
      isFirst: boolean;
      isLast: boolean;
    }[]
  >([]);

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
      //console.log(res);
      return res;
    },
    enabled: !!id,
  });

  const other = getChatOthers(conversation.data, currentUser)[0];

  const { data: contact } = useQuery<UserType>({
    queryKey: ["user", other?.id],
    queryFn: async () => {
      const res = (await newRequest(`/user/id/${other?.id}`)).data;
      return res;
    },
    enabled: !!conversation && !!other
  });

  const messages = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const res = (await newRequest.get(`/${id}/messages`)).data.messages;
      const newMessages = res.map((message: MessageType, index: number) => ({
        ...message,
        isFirst: res[index - 1]?.sender_id !== message.sender_id,
        isLast: res[index + 1]?.sender_id !== message.sender_id,
      }));
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
    setTmpMessages((prev) =>
      prev.filter((message) => message.status !== "sent")
    );
  }, [messages.data]);

  useEffect(() => {
    setTmpMessages((prev) =>
      prev.filter((message) => message.status !== "sent")
    );
  }, [messages.data]);
  
  useEffect(() => {
    setShowDetail(false);
  }, [id]);

  useEffect(() => {
    socket.on(
      SocketEvent.TYPING_STARTED,
      ({user_id, username, conversation_id }: typingSocketData) => {
        // Show typing indicator in other conversation members' screens
        const conversations = queryClient.getQueryData([
          "conversations",
        ]) as ConversationType[];
        if (
          conversations.find(
            (conversation) => conversation.id === conversation_id
          ) &&
          user_id !== currentUser.id
        ) {
          setIsTyping((prev) =>
            !prev.find(
              (user) =>
                user.username === username &&
                user.conversationId === conversation_id
            )
              ? [...prev, { username, conversationId: conversation_id }]
              : [...prev]
          );
        }
        //console.log("typing started", username);
      }
    );
    socket.on(
      SocketEvent.TYPING_STOPPED,
      ({user_id, username, conversation_id }: typingSocketData) => {
        // Hide typing indicator
        const conversations = queryClient.getQueryData([
          "conversations",
        ]) as ConversationType[];
        if (
          conversations.find(
            (conversation) => conversation.id === conversation_id
          ) &&
          user_id !== currentUser.id
        ) {
          setIsTyping((prev) =>
            prev.filter(
              (user) =>
                user.username !== username &&
                user.conversationId !== conversation_id
            )
          );
        }
        //console.log("typing stopped", username);
      }
    );
    //console.log("typing", isTyping);

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
        if (id)
          createCallMessage.mutate({
            conversation_id: id,
            user_id: currentUser.id,
            status:
              data?.endStatus === "missed"
                ? "m"
                : data?.endStatus === "rejected"
                ? "r"
                : data?.endStatus === "answered"
                ? "a"
                : "f",
            duration: data.duration || 0,
          });
        console.log("call", data?.endStatus);
        if (data.endStatus === "answered")
          toast.info(`Call lasted ${formatTime(data.duration as number)}`);

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
        console.log("call", data?.endStatus);
        if (data.endStatus === "answered")
          toast.info(`Call lasted ${formatTime(data.duration as number)}`);
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

  const createCallMessage = useMutation({
    mutationFn: async (data: {
      user_id: string;
      conversation_id: string;
      status: string;
      duration: number;
    }) => {
      console.log("call message", data);
      const res = (await newRequest.post(`/message/create_call`, data)).data;
      return res;
    },
    onSuccess: (data: MessageType) => {
      socket.emit(SocketEvent.SEND_MESSAGE, { message_id: data.id });
    },
    onError: (error) => {
      console.log(error);
    },
  });

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
    <div
      className={`flex items-center justify-center relative flex-1 w-full h-full`}
    >
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
      ) : (
        <div
          className={`flex-1 h-screen flex-col relative ${
            showDetail ? "hidden md:flex lg:hidden xl:flex" : "flex"
          }`}
        >
          <ChatHeader
            conversation={conversation?.data}
            isLoading={conversation.isLoading}
            setShowDetail={setShowDetail}
            startCall={handleCall}
          />
          {/* Messages Container*/}
          {conversation.isLoading || messages.isLoading ? (
            <LoadingSpinner />
          ) : (
            conversation.data && (
              <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-1 pl-16 items-start">
                {messages.data?.length > 0 ? (
                  [...messages.data, ...tmpMessages].map(
                    (
                      message: MessageType & {
                        messageId: number;
                        isFirst: boolean;
                        isLast: boolean;
                      }
                    ) => (
                      <Message
                        key={message.id || message.messageId}
                        message={message}
                        isFirst={message.isFirst}
                        isLast={message.isLast}
                        username={
                          conversation.data?.users.filter(
                            (user) => user.id === message.sender_id
                          )[0]?.username
                        }
                        photoUrl={
                          conversation.data?.users.filter(
                            (user) => user.id === message.sender_id
                          )[0]?.profile_url
                        }
                      />
                    )
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center self-center text-center p-6 h-full rounded-lg">
                    <IoChatbubbleEllipsesOutline className="text-gray-400 text-6xl mb-4" />
                    <h2 className="text-lg font-semibold text-gray-700">
                      No messages yet
                    </h2>
                    <p className="text-gray-500">
                      Start the conversation by sending the first message!
                    </p>
                  </div>
                )}
                <TypingIndicator isTyping={isTyping} />
                <div ref={lastMessageRef}></div>
              </div>
            )
          )}
          <ChatFooter
            text={text}
            setText={setText}
            handleTyping={handleTyping}
            setTmpMessages={setTmpMessages}
            contactId={conversation.data?.group ? undefined : other?.id}
            showDetail={showDetail}
          />
        </div>
      )}
      {showDetail && (
        <div className="w-full md:w-1/2 lg:w-full xl:w-2/5 h-full overflow-auto shadow-lg shadow-primary-purple/15 border-primary-purple/20">
          <Detail
            conversation={conversation.data}
            onClose={() => setShowDetail(false)}
            user={contact}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBoard;
