import { useState } from "react";
import EmojiPicker from "emoji-picker-react"; // Replace with your actual emoji picker import
import Message from "./components/Message";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import { MessageType } from "../../types";

type Emoji = {
  emoji: string;
};

interface ChatProps {
  name: string;
}

const Chat = ({ name }: ChatProps) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  const messages = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = (await newRequest.get(`/messages/${id}`)).data;
      console.log(res);
      return res;
    },
  });
  const EmojHandle = (e: Emoji) => {
    setText(text + e.emoji);
  };

  return (
    <div className="flex-2 border-r border-[#e8e2e2] h-screen flex flex-col relative">
      {/* Header */}
      <div className="p-2.5 flex items-center justify-between border-b border-[#e8e2e2]">
        <div className="flex items-center gap-5">
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
          <img src="/info3.png" alt="" className="w-5 h-5" />
        </div>
      </div>
      {/* Messages Container*/}
      <div className="p-5 flex-1 overflow-scroll flex flex-col gap-5 pb-16">
        {messages?.data?.map((message: MessageType) => (
          <Message key={message.id} message={message} />
        ))}
        <div />
      </div>
      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full p-2.5 flex bg-white items-center justify-between border-t border-[#e8e2e2] gap-5 mt-auto">
        <div className="flex gap-5">
          <img src="/plusblack.png" className="w-5 h-5 cursor-pointer" />
          <img src="/camera.png" className="w-5 h-5 cursor-pointer" />
          <img src="/microphone.png" className="w-5 h-5 cursor-pointer" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-black p-5 rounded-xl text-lg"
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
        <button className="bg-[#882A85] text-white py-2 px-5 rounded-md text-lg ">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
