import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react"; // Replace with your actual emoji picker import
import Message from "./components/Message";
import { useMutation, useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate, useParams } from "react-router-dom";
import { ConversationType, MessageType } from "../../types";

type Emoji = {
  emoji: string;
};

interface ChatProps {
  conversation: ConversationType;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chat = ({ conversation, setShowDetail }: ChatProps) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();
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

  const createMessage = useMutation({
    mutationFn: async (text: string) => {
      const res = await newRequest.post(`/${id}/messages`, {
        text,
      });
      console.log(res.data);
      return res.data;
    },
    onSuccess: () => {
      setText("");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSendMessage = async () => {
    if (text.trim() === "") return;
    createMessage.mutate(text);
  };
  const name = conversation?.group
    ? conversation.name
    : conversation?.others[0].username;
  return (
    <div className="flex-2 border-r border-[#e8e2e2] h-screen flex flex-col relative">
      {/* Header */}
      <div className="p-2.5 flex items-center justify-between border-b border-[#e8e2e2]">
        <div className="flex items-center gap-5">
          <button className="lg:hidden" onClick={() => navigate('/conversations')} >{'<<'}</button>
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
          <button onClick={() => setShowDetail(prev => !prev)}>
          <img src="/info3.png" alt="" className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Messages Container*/}
      <div className="p-5 flex-1 overflow-scroll flex flex-col gap-5 pb-16">
        {messages?.data
          ?.sort((a: MessageType, b: MessageType) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          })
          .map((message: MessageType) => (
            <Message key={message.id} message={message} />
          ))}
        <div />
      </div>
      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full p-2.5 flex bg-white items-center justify-between border-t border-[#e8e2e2] gap-5 mt-auto">
        <div className="flex gap-5">
          <img src="/plusblack.png" className="w-5 h-5 cursor-pointer" />
          <img src="/camera.png" className="w-5 h-5 cursor-pointer hidden md:block" />
          <img src="/microphone.png" className="w-5 h-5 cursor-pointer hidden md:block" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
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
