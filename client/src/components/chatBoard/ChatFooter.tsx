import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import newRequest from "../../utils/newRequest";
import { MessageType } from "../../types";
import socket from "../../socket";
import { SocketEvent } from "../../utils/socketEvents";
import { useParams } from "react-router-dom";
import { getUser } from "../../utils/localStorage";

type Emoji = {
  emoji: string;
};

type MessageDataType = {
  conversation_id?: string;
  user_id: string;
  message_text: string;
};

interface ChatFooterProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatFooter = ({ text, setText, handleTyping }: ChatFooterProps) => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const currentUser = getUser();

  const EmojHandle = (e: Emoji) => {
    setText(prev => prev + e.emoji);
  };

  // Create a new message
  const createMessage = useMutation({
    mutationFn: async (data: MessageDataType) => {
      console.log(data);

      const res = await newRequest.post(`/message/create`, data);
      //console.log(res.data);
      return res.data;
    },
    onSuccess: (message: MessageType) => {
      // Clear the input field and refetch messages
      setText("");
      socket.emit(SocketEvent.SEND_MESSAGE, { message_id: message.id });
      queryClient.invalidateQueries({
        queryKey: ["messages", message.conversation_id],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSendMessage = async () => {
    if (text.trim() === "") return;
    const messageData: MessageDataType = {
      conversation_id: id,
      user_id: currentUser.id,
      message_text: text,
    };
    createMessage.mutate(messageData);
  };

  return (
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
          onClick={() => setOpenEmoji((prev) => !prev)}
        />
        <div
          className={`absolute bottom-12 -right-12 ${
            openEmoji ? "block" : "hidden"
          }`}
        >
          <EmojiPicker open={openEmoji} onEmojiClick={EmojHandle} />
        </div>
      </div>
      <button
        onClick={handleSendMessage}
        className="bg-[#882A85] text-white py-2 px-5 rounded-md text-lg "
      >
        Send
      </button>
    </div>
  );
};

export default ChatFooter;
