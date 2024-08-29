import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { MessageType } from "../../../types";

interface ChatListItemProps {
  name: string;
  lastMessageId: string;
  conversationId: string;
  selected?: boolean;
}

const ChatListItem = ({ name, lastMessageId, conversationId, selected }: ChatListItemProps) => {
  const navigate = useNavigate();

  const lastMessage = useQuery<MessageType>({
    queryKey: ["message", lastMessageId],
    queryFn: async () => {
      const res = (await newRequest.get(`/message/${lastMessageId}`)).data;
      console.log(res);
      return res;
    },
  });

  return (
    <div
      onClick={() => navigate(`/conversations/${conversationId}`)}
      className={`flex items-center gap-5 w-full p-3 cursor-pointer border-l-[5px] border-b  border-[#e8e2e2] ${selected? " border-l-primary-purple" : "border-l-transparent"}`}
    >
      <img
        src="/user.png"
        alt=""
        className="w-11 h-11 rounded-full object-cover"
      />
      <div className="flex flex-col gap-1 w-2/3">
        <span className="font-light">{name || "Julie Li"}</span>
        <p className="text-xs truncate">{lastMessage?.data?.message_text}</p>
      </div>
    </div>
  );
};

export default ChatListItem;
