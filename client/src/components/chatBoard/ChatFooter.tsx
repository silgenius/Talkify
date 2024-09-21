import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import newRequest from "../../utils/newRequest";
import { ContactType, MessageType } from "../../types";
import socket from "../../socket";
import { SocketEvent } from "../../utils/socketEvents";
import { useParams } from "react-router-dom";
import { getUser } from "../../utils/localStorage";
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
    React.SetStateAction<
      {
        messageId: number;
        message_text: string;
        status: "sending" | "failed" | "sent";
        isFirst: boolean;
        isLast: boolean;
      }[]
    >
  >;
  contactId?: string;
  showDetail: boolean;
}

const ChatFooter = ({
  text,
  setText,
  handleTyping,
  setTmpMessages,
  contactId,
  showDetail,
}: ChatFooterProps) => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const currentUser = getUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tmpText, setTmpText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setText(tmpText[id as string] || "");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [id, setText, tmpText]);

  const handleEmojiSelect = (e: Emoji) => {
    setText((prev) => prev + e.emoji);
  };

  const createMessage = useMutation({
    mutationFn: async (data: MessageDataType & { messageId: number }) => {
      const res = await newRequest.post(`/message/create`, data);
      
      return { ...res.data, messageId: data.messageId };
    },
    onSuccess: (message: MessageType & {messageId: number}) => {
      socket.emit(SocketEvent.SEND_MESSAGE, { message_id: message.id });
      socket.emit(SocketEvent.STOP_TYPING, {
        conversation_id: id,
        sender_id: currentUser.id,
      });
      
      setTmpMessages((prev) => {
        const lastMessage = prev.find(
          (msg) => msg.messageId === message.messageId
        );
        if (lastMessage) {
          lastMessage!.status = "sent";
        }
        return [...prev];
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", message.conversation_id],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error, data) => {
      //toast.error("An error occurred. Please try again later");
      setTmpMessages((prev) => {
        const lastMessage = prev.find(
          (msg) => msg.messageId === data.messageId
        );
        if (lastMessage) {
          lastMessage!.status = "failed";
        }
        return [...prev];
      })
      console.log(error);
    },
  });

  const handleSendMessage = () => {
    if (text.trim() === "") return;
    const messageId = Math.random() * 1000000; 
    const messageData: MessageDataType & { messageId: number } = {
      messageId: messageId,
      conversation_id: id,
      user_id: currentUser.id,
      message_text: text,
    };
    createMessage.mutate(messageData);

    setTmpMessages((prev) => [
      ...prev,
      {
        messageId: messageId,
        conversation_id: id,
        sender_id: currentUser.id,
        message_text: text,
        status: "sending",
        isLast: true,
        isFirst: true,
      },
    ]);

    setText("");
    setTmpText((prev) => ({ ...prev, [id as string]: "" }));
  };

  // Handler to detect Enter key press and send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default action of Enter (like form submission)
      handleSendMessage();
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTmpText((prev) => ({ ...prev, [id as string]: e.target.value }));
    handleTyping(e);
  };
  const [isBlocked, setIsBlocked] = useState(false);

  const contacts = queryClient.getQueryData<ContactType[]>(["contacts"]);
  useEffect(() => {
    const contact = contacts?.find(
      (contact) => contact.contact.id === contactId
    );
    setIsBlocked(contact?.status === "blocked");
  }, [contacts, contactId, queryClient]);
  return (
    <div className="w-full border-primary-purple/20 min-h-16 p-3 flex bg-whie items-center justify-between shadow-[7px_-1px_10px_rgba(0,0,0,0.1)] shadow-primary-purple/10 gap-4">
      {isBlocked ? (
        <div className="text-gray-500 w-full text-center">
          this user is unavailable
        </div>
      ) : (
        <>
          {/* Action Icons */}
          <div className="flex gap-4 text-gray-500">
            <BsPlus className="w-6 h-6 cursor-pointer" />
            <BsCameraVideo className="w-6 h-6 cursor-pointer hidden md:block" />
            <BsMic className="w-6 h-6 cursor-pointer hidden md:block" />
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} // Add keydown event listener here
            className="flex-1 bg-gray-100 border-gray-300 rounded-lg px-4 py-2 placeholder:text-gray-500 text-black outline-none focus:ring-2 focus:ring-primary-purple/30"
          />

          {/* Emoji Picker */}
          <div
            className={`relative ${
              showDetail ? "hidden xl:block" : ""
            } hidden xs:block`}
          >
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
        </>
      )}
    </div>
  );
};

export default ChatFooter;
