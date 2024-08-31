import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react"; // Replace with your actual emoji picker import
import Message from "./components/Message";
import { useMutation, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import { ConversationType, MessageType } from "../../types";
import { getUser } from "../../utils/localStorage";
import socket from "../../utils/socket";
import { SocketEvent } from "../../utils/socketEvents";

type Emoji = {
  emoji: string;
};

type MessageDataType = {
  conversation_id?: string;
  user_id: string;
  message_text: string;
};

interface ChatProps {
  conversation: ConversationType;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chat = ({ conversation, setShowDetail }: ChatProps) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { id } = useParams();
  const currentUser = getUser();
  const navigate = useNavigate();
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  const messages = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const res = (await newRequest.get(`/${id}/messages`)).data;
      //console.log(res);
      return res.messages;
    },
  });
  const EmojHandle = (e: Emoji) => {
    setText(text + e.emoji);
  };

  useEffect(() => {
    // Scroll to the last message whenever the messages array changes
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  useEffect(() => {
    socket.on(
      "typing_started",
      ({
        username,
        conversation_id,
      }: {
        username: string;
        conversation_id: string;
      }) => {
        // Show typing indicator
        if (conversation_id === id && username !== currentUser.username) {
          setIsTyping(true);
        }
      }
    );

    socket.on(
      "typing_stopped",
      ({
        username,
        conversation_id,
      }: {
        username: string;
        conversation_id: string;
      }) => {
        // Hide typing indicator
        if (conversation_id === id && username !== currentUser.username) {
          setIsTyping(false);
        }
      }
    );

    // Cleanup on component unmount
    return () => {
      socket.off("typing_started");
      socket.off("typing_stopped");
    };
  }, [currentUser, id]);

  const createMessage = useMutation({
    mutationFn: async (data: MessageDataType) => {
      console.log(data);

      const res = await newRequest.post(`/message/create`, data);
      //console.log(res.data);
      return res.data;
    },
    onSuccess: (message: MessageType) => {
      console.log("Message sent", message);
      setText("");
      socket.emit(SocketEvent.SEND_MESSAGE, { message_id: message.id });
      messages.refetch();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);

    // Emit the 'start_typing' event when the user starts typing

    socket.emit("start_typing", {
      conversation_id: conversation.id,
      sender_id: currentUser.id,
    });

    // Clear any previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a timeout to emit 'stop_typing' event after a period of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        conversation_id: conversation.id,
        sender_id: currentUser.id,
      });
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (text.trim() === "") return;
    const messageData: MessageDataType = {
      conversation_id: id,
      user_id: currentUser.id,
      message_text: text,
    };
    createMessage.mutate(messageData);
  };
  const name = conversation?.group
    ? conversation.name
    : conversation?.others[0].username;
  return (
    <div className="flex-2 border-r border-[#e8e2e2] h-screen flex flex-col relative">
      {/* Header */}
      <div className="p-2.5 flex items-center justify-between border-b border-[#e8e2e2]">
        <div className="flex items-center gap-5">
          <button
            className="lg:hidden"
            onClick={() => navigate("/conversations")}
          >
            {"<<"}
          </button>
          <img
            src="/user.png"
            alt=""
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-lg font-bold">{name || "Julie Li"}</span>
          </div>
        </div>
        <div className="flex gap-5">
          <img src="/call.png" alt="" className="w-5 h-5" />
          <button onClick={() => setShowDetail((prev) => !prev)}>
            <img src="/info3.png" alt="" className="w-5 h-5" />
          </button>
        </div>
      </div>
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
        {isTyping && <p>Typing...</p>}
      </div>
      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full p-2.5 flex bg-white items-center justify-between border-t border-[#e8e2e2] gap-5 mt-auto">
        <div className="flex gap-5">
          <img src="/plusblack.png" className="w-5 h-5 cursor-pointer" />
          <img
            src="/camera.png"
            className="w-5 h-5 cursor-pointer hidden md:block"
          />
          <img
            src="/microphone.png"
            className="w-5 h-5 cursor-pointer hidden md:block"
          />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={handleTyping}
          className="flex-1 bg-transparent w-full border-none outline-none text-black p-5 rounded-xl text-lg"
        />
        <div className="relative">
          <img
            src="/emoji.png"
            alt=""
            className="cursor-pointer w-6 h-6"
            onClick={() => setOpen((prev) => !prev)}
          />
          <div
            className={`absolute bottom-12 -right-12 ${
              open ? "block" : "hidden"
            }`}
          >
            <EmojiPicker open={open} onEmojiClick={EmojHandle} />
          </div>
        </div>
        <button
          onClick={handleSendMessage}
          className="bg-[#882A85] text-white py-2 px-5 rounded-md text-lg "
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
