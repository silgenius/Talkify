import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { ContactType, MessageType } from "../../../types";
import { useEffect, useState } from "react";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import socket from "../../../socket";
import { SocketEvent } from "../../../utils/socketEvents";
import { getUser } from "../../../utils/localStorage";
import { toast } from "react-toastify";
import GroupIcon from "../../common/GroupIcon";

interface ChatListItemProps {
  name: string;
  lastMessageId: string;
  conversationId: string;
  isGroup?: boolean;
  selected?: boolean;
  photoUrl?: string;
  contactId?: string;
}

const ConversationItem = ({
  name,
  lastMessageId,
  conversationId,
  selected,
  isGroup = false,
  photoUrl,
  contactId,
}: ChatListItemProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isRead, setIsRead] = useState(true);
  const currentUser = getUser();
  const { id: currentConversationId } = useParams();
  const queryClient = useQueryClient();

  const contact = queryClient
    .getQueryData<ContactType[]>(["contacts"])
    ?.find((contact) => contact.contact.id === contactId);

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
    enabled: !!lastMessageId,
  });

  const { data: lastMessageSender, isLoading: lastMessageLoading } = useQuery({
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
      if (
        lastMessage.status === "sent" &&
        currentConversationId !== conversationId
      ) {
        console.log("deliver message", lastMessage);
        socket.emit(SocketEvent.DELIVER_MESSAGE, {
          message_id: lastMessage.id,
        });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, error]);

  const exitGroup = useMutation({
    mutationFn: async (data: { conversation_id: string; user_id: string }) => {
      const res = await newRequest.put(`/conversation/group/remove`, data);
      return res.data;
    },
    onSuccess: (data: MessageType) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
      socket.emit(SocketEvent.SEND_MESSAGE, { message_id: data.id });
      toast.info("You have left the group " + name);
      navigate("/");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Failed to leave the group");
    },
  });

  const blockUser = useMutation({
    mutationFn: async (data: { sender_id: string; receiver_id: string }) => {
      const res = (await newRequest.post(`/block`, data)).data;
      console.log(res);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.info("User blocked successfully");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Failed to block user");
    },
  });

  const unblockUser = useMutation({
    mutationFn: async (data: { sender_id: string; receiver_id: string }) => {
      const res = (await newRequest.post(`/unblock`, data)).data;
      console.log(res);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.info("User unblocked successfully");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Failed to unblock user");
    },
  });

  const handleExit = () => {
    exitGroup.mutate({
      conversation_id: conversationId,
      user_id: currentUser.id,
    });
  };

  const handleBlock = () => {
    blockUser.mutate({
      sender_id: currentUser.id,
      receiver_id: contactId as string,
    });
  };

  const handleUnblock = () => {
    unblockUser.mutate({
      sender_id: currentUser.id,
      receiver_id: contactId as string,
    });
  };

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
        {isGroup ? (
          <GroupIcon className="!w-12 !h-12" />
        ) : (
          <img
            src={photoUrl || "/user.png"}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-contain object-center"
          />
        )}
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
            {lastMessageLoading ? (
              <div className="w-40 h-2 bg-gray-300 rounded animate-pulse" />
            ) : !lastMessage ? (
              <></>
            ) : (
              <p className={`text-sm max-w-[95%] truncate ${"text-gray-600"}`}>
                {lastMessage?.sender_id === currentUser.id
                  ? "You: "
                  : isGroup &&
                    lastMessage?.message_type !== "exited" &&
                    lastMessageSender?.username + ": "}

                {lastMessage?.message_type !== "text" &&
                lastMessage?.message_type !== "exited"
                  ? lastMessage?.message_type + " call"
                  : lastMessage?.message_text || "No messages"}
              </p>
            )}
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
            {isGroup ? (
              <>
                <MenuDivider />
                <MenuItem onClick={handleExit}>Exit group</MenuItem>
              </>
            ) : (
              <>
                <MenuDivider />
                {contact?.status !== "blocked" ? (
                  <MenuItem onClick={handleBlock}>Block user</MenuItem>
                ) : (
                  <MenuItem onClick={handleUnblock}>Unblock user</MenuItem>
                )}
              </>
            )}
          </Menu>
        </div>
      )}
    </div>
  );
};

export default ConversationItem;
