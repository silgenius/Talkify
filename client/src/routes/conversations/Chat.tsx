import React, { useEffect, useRef, useState } from "react";
import Message from "./components/Message";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import { ConversationType, MessageType } from "../../types";
import { getUser } from "../../utils/localStorage";
import socket from "../../socket";
import { SocketEvent } from "../../utils/socketEvents";
import ChatHeader from "./components/ChatHeader";
import ChatFooter from "./components/ChatFooter";
import TypingIndicator from "./components/TypingIndicator";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { toast } from "react-toastify";
import Detail from "../../components/detail/Detail";
import EmptyChat from "./components/EmptyChat";
import { AxiosError } from "axios";

type typingSocketData = {
  username: string;
  conversation_id: string;
};

const Chat = () => {
  const [text, setText] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [isTyping, setIsTyping] = useState<string[]>([]);

  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

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
  });

  const messages = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const res = (await newRequest.get(`/${id}/messages`)).data;
      //console.log(res);
      return res.messages;
    },
    enabled: !!conversation.data,
  });

  useEffect(() => {
    //scroll to the last message
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

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
    // Cleanup on component unmount
    return () => {
      socket.off(SocketEvent.TYPING_STARTED);
      socket.off(SocketEvent.TYPING_STOPPED);
    };
  }, [currentUser, id]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    console.log("emit start typing");
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

  useEffect(() => {
    if (conversation.error) {
      if (conversation.isPlaceholderData) {
        toast.error("Could not load messages");
      } else {
        const error = conversation.error as AxiosError;
        if (error.response?.status === 404) toast.error("Conversation not found");
        else toast.error("Could not load conversation");
        navigate("/");
      }
    }
  }, [conversation.error, conversation.isPlaceholderData, navigate]);

  return (
    <div className="w-full">
      {!id ? (
        <EmptyChat />
      ) : conversation.isLoading ? (
        <LoadingSpinner />
      ) : (
        conversation.data && (
          <div className="flex-2 border-r border-[#e8e2e2] h-screen flex flex-col relative">
            <ChatHeader
              conversation={conversation.data}
              setShowDetail={setShowDetail}
            />
            {/* Messages Container*/}
            <div className="p-5 flex-1 overflow-scroll flex flex-col gap-5 pb-24">
              {messages?.data
                ?.sort((a: MessageType, b: MessageType) => {
                  return (
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
                  );
                })
                .map((message: MessageType, index: number) => (
                  <Message
                    lastMessageRef={
                      index === messages.data.length - 1 ? lastMessageRef : null
                    }
                    key={message.id}
                    message={message}
                  />
                ))}
              <TypingIndicator isTyping={isTyping} />
            </div>
            <ChatFooter
              text={text}
              setText={setText}
              handleTyping={handleTyping}
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

export default Chat;
