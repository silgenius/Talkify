import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { MessageType } from "../../../types";
import { useEffect, useState } from "react";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import socket from "../../../socket";
import { SocketEvent } from "../../../utils/socketEvents";
import { getUser } from "../../../utils/localStorage";

interface ChatListItemProps {
  name: string;
  lastMessageId: string;
  conversationId: string;
  isGroup?: boolean;
  selected?: boolean;
  photoUrl?: string;
}

const ConversationItem = ({
  name,
  lastMessageId,
  conversationId,
  selected,
  isGroup = false,
  photoUrl,
}: ChatListItemProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isRead, setIsRead] = useState(true);
  const currentUser = getUser();
  const {
    data: lastMessage,
    isLoading,
    error,
  } = useQuery<MessageType>({
    queryKey: ["message", lastMessageId],
    queryFn: async () => {
      const res = (await newRequest.get(`/message/${lastMessageId}`)).data;
      return res;
    },
  });

  const { data: lastMessageSender } = useQuery({
    queryKey: ["user", lastMessage?.sender_id],
    queryFn: async () => {
      const res = (await newRequest(`user/id/${lastMessage?.sender_id}`)).data;
      //console.log("user", res);
      return res;
    },
    enabled: !!lastMessage,
  });

  useEffect(() => {
    if (!error && lastMessage && currentUser.id !== lastMessage.sender_id) {
      setIsRead(lastMessage.status === "seen");
      if (lastMessage.status === "sent") {
        console.log("message delivered", lastMessage.message_text);
        socket.emit(SocketEvent.DELIVER_MESSAGE, {
          message_id: lastMessage.id,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, error]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={() => navigate(`/conversation/${conversationId}`)}
        className={`flex items-center gap-4 p-4 cursor-pointer  transition-all duration-300 ease-in-out ${
          selected
            ? "bg-gray-100 rounded-l-lg border-l-[5px] border-l-primary-purple"
            : "bg-white border-l-4 border-l-transparent"
        } shadow-lg border-b border-gray-200 hover:bg-gray-100 ${
          !isRead ? "font-medium  shadow-md" : ""
        }`}
      >
        <img
          src={photoUrl || "/user.png"}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-contain object-center"
        />
        <div className="flex flex-col w-full overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center justify-center space-x-3">
              <span className={`text-lg ${!isRead ? "font-bold" : ""}`}>
                {name || "Julie Li"}
              </span>
              {!isRead && (
                <div className="w-2 h-2 rounded-full bg-primary-purple" />
              )}
            </div>
            {!isHovered &&
              (isLoading ? (
                <div className="w-20 h-2 bg-gray-300 rounded animate-pulse" />
              ) : (
                <span className={`text-sm ${"text-gray-500"}`}>
                  {lastMessage?.created_at
                    ? new Date(lastMessage?.created_at).toLocaleTimeString(
                        "US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : "Just now"}
                </span>
              ))}
          </div>
          <div className="flex justify-between items-center">
            <p className={`text-sm max-w-[95%] truncate ${"text-gray-600"}`}>
              {lastMessage?.sender_id === currentUser.id
                ? "You: "
                : isGroup && lastMessageSender?.username + ": "}
              {lastMessage?.message_text || "No message"}
            </p>
          </div>
        </div>
      </div>
      {isHovered && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 z-20">
          <Menu
            transition
            menuButton={
              <button className="w-8 h-8 shadow-md flex items-center justify-center bg-gray-300 text-white rounded-full hover:bg-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            }
          >
            <MenuItem
              onClick={() => {
                setTimeout(() => {
                  setIsRead((prev) => !prev);
                }, 300);
              }}
            >
              Mark as {isRead ? "unread" : "read"}
            </MenuItem>
            <MenuItem>Mute notifications</MenuItem>
            {isGroup && (
              <>
                <MenuDivider />
                <MenuItem>Exit group</MenuItem>
              </>
            )}
          </Menu>
        </div>
      )}
    </div>
  );
};

export default ConversationItem;
