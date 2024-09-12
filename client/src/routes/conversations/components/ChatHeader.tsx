import { useNavigate } from "react-router-dom";
import { ConversationType } from "../../../types";

interface ChatHeaderProps {
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
  conversation: ConversationType;
}

const ChatHeader = ({ setShowDetail, conversation }: ChatHeaderProps) => {
  const navigate = useNavigate();

  const name = conversation.group
    ? conversation.name
    : conversation.users[0].username;

  return (
    <div className="p-2.5 flex items-center justify-between border-b border-[#e8e2e2]">
      <div className="flex items-center gap-5">
        <button
          className="lg:hidden"
          onClick={() => navigate("/conversations")}
        >
          {"<<"}
        </button>
        <img
          src="/user.png"
          alt=""
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-bold">{name}</span>
        </div>
      </div>
      <div className="flex gap-5">
        <img src="/call.png" alt="" className="w-5 h-5" />
        <button onClick={() => setShowDetail((prev) => !prev)}>
          <img src="/info3.png" alt="" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
