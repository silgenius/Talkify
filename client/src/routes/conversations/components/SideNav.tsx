import { ConversationType } from "../../../types";
import { useNavigate, useParams } from "react-router-dom";
import { talkifyLogo } from "../../../assets";
import { UseQueryResult } from "@tanstack/react-query";
import ConversationItem from "./ConversationItem";
import Skeleton from "../../../components/common/Skeleton";
import Error from "../../../components/common/Error";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import { removeUser } from "../../../utils/localStorage";

const SideNav = ({
  conversations,
}: {
  conversations: UseQueryResult<ConversationType[], Error>;
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (conversations.isError) {
      toast.error("An error occurred. Please try again later");
    }
  }, [conversations.isError]);

  return (
    <div className="flex flex-col bg-[#F1F2F6] w-1/4 h-screen shadow-xl">
      <div className="flex flex-col items-start mb-1.5 flex-shrink-0">
        <div className="flex items-center justify-between w-full px-4 py-2">
          <img
            src={talkifyLogo}
            alt="Talkify Logo"
            className="w-20 h-20 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
          <div>
            <Menu
              menuButton={
                <img
                  src="/setting.png"
                  alt="Settings"
                  className="w-5 h-5 cursor-pointer"
                />
              }
              transition
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  removeUser();
                  navigate("/");
                }}
                className="space-x-4"
              >
                <img src="/logout.png" alt="Logout" className="w-4 h-4" />
                <p>Logout</p>
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div className="flex items-center justify-between w-full px-4 py-2">
          <p className="text-3xl font-bold text-[#333333]">Chats</p>
          <div className="flex items-center justify-center w-6 h-6 bg-[#882A85] rounded-full cursor-pointer">
            <img src="/plus.png" alt="" className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-5 p-5 w-full">
          <div className="flex-1 bg-[#a0a2aa44] flex items-center gap-5 rounded-full px-1">
            <img src="/searchblack.png" alt="" className="w-3 h-3" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none text-black flex-1"
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.isLoading ? (
          <>
            <Skeleton />
            <Skeleton />
          </>
        ) : conversations.isError ? (
          <Error onRetry={() => conversations.refetch()} />
        ) : (
          conversations.data?.map((conversation: ConversationType) => (
            <ConversationItem
              key={conversation.id}
              name={
                conversation.group
                  ? conversation.name
                  : conversation.others[0].username
              }
              lastMessageId={conversation.last_message_id}
              conversationId={conversation.id}
              selected={id === conversation.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SideNav;
