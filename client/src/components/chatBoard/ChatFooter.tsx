import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import newRequest from "../../utils/newRequest";
import { MessageType } from "../../types";
import socket from "../../socket";
import { SocketEvent } from "../../utils/socketEvents";
import { useParams } from "react-router-dom";
import { getUser } from "../../utils/localStorage";

// Importing icons from react-icons
import { BsPlus, BsCameraVideo, BsMic, BsSend } from "react-icons/bs";

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
  setTmpMessages: React.Dispatch<
    React.SetStateAction<{ message_text: string; status: "sending" }[]>
  >;
}

const ChatFooter = ({
  text,
  setText,
  handleTyping,
  setTmpMessages,
}: ChatFooterProps) => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const currentUser = getUser();

  const handleEmojiSelect = (e: Emoji) => {
    setText((prev) => prev + e.emoji);
  };

  const createMessage = useMutation({
    mutationFn: async (data: MessageDataType) => {
      const res = await newRequest.post(`/message/create`, data);
      return res.data;
    },
    onSuccess: (message: MessageType) => {
      socket.emit(SocketEvent.SEND_MESSAGE, { message_id: message.id });
      socket.emit(SocketEvent.STOP_TYPING, {
        conversation_id: id,
        sender_id: currentUser.id,
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", message.conversation_id],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSendMessage = () => {
    if (text.trim() === "") return;

    const messageData: MessageDataType = {
      conversation_id: id,
      user_id: currentUser.id,
      message_text: text,
    };
    createMessage.mutate(messageData);
    setTmpMessages((prev) => [
      ...prev,
      {
        conversation_id: id,
        sender_id: currentUser.id,
        message_text: text,
        status: "sending",
        isLast: true,
        isFirst: true,
      },
    ]);
    setText("");
  };

  // Handler to detect Enter key press and send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default action of Enter (like form submission)
      handleSendMessage();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full p-3 flex bg-white items-center justify-between shadow-[7px_-1px_10px_rgba(0,0,0,0.1)] shadow-primary-purple/10 gap-4">
      {/* Action Icons */}
      <div className="flex gap-4 text-gray-500">
        <BsPlus className="w-6 h-6 cursor-pointer" />
        <BsCameraVideo className="w-6 h-6 cursor-pointer hidden md:block" />
        <BsMic className="w-6 h-6 cursor-pointer hidden md:block" />
      </div>

      {/* Text Input */}
      <input
        autoFocus={true}
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={handleTyping}
        onKeyDown={handleKeyDown} // Add keydown event listener here
        className="flex-1 bg-gray-100 border-gray-300 rounded-lg px-4 py-2 text-black outline-none focus:ring-2 focus:ring-primary-purple/30"
      />

      {/* Emoji Picker */}
      <div className="relative">
        <img
          src="/emoji.png"
          alt="Emoji"
          className="cursor-pointer w-7 h-7"
          onClick={() => setOpenEmoji((prev) => !prev)}
        />
        {openEmoji && (
          <div className="absolute bottom-10 right-0">
            <EmojiPicker onEmojiClick={handleEmojiSelect} />
          </div>
        )}
      </div>

      {/* Send Button */}
      <button
        onClick={handleSendMessage}
        className="bg-primary-purple text-white p-3 rounded-full hover:bg-fuchsia-900 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
      >
        <BsSend className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatFooter;
