import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";

interface ChatListItemProps {
  name: string;
  lastMessageId: string;
  conversationId: string;
  selected?: boolean;
}

const ChatListItem = ({ name, lastMessageId, conversationId, selected }: ChatListItemProps) => {
  const navigate = useNavigate();

  const lastMessage = useQuery({
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
      className={`flex items-center gap-5 p-3 cursor-pointer border-l-[5px] border-b  border-[#e8e2e2] ${selected? " border-l-primary-purple" : "border-l-transparent"}`}
    >
      <img
        src="/user.png"
        alt=""
        className="w-11.25 h-11.25 rounded-full object-cover"
      />
      <div className="flex flex-col gap-1">
        <span className="font-light">{name || "Julie Li"}</span>
        <p className="text-xs">{lastMessage?.data}</p>
      </div>
    </div>
  );
};

export default ChatListItem;
