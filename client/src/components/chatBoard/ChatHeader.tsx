import { useNavigate } from "react-router-dom";
import { ConversationType } from "../../types";
import { getUser } from "../../utils/localStorage";

interface ChatHeaderProps {
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
  conversation: ConversationType;
  startCall: () => void;
}

const ChatHeader = ({
  setShowDetail,
  conversation,
  startCall,
}: ChatHeaderProps) => {
  const navigate = useNavigate();

  const { name, photoUrl } = conversation.group
    ? { name: conversation.name, photoUrl: null }
    : {
        name: conversation.users.filter((user) => user.id !== getUser().id)[0]
          .username,
        photoUrl: conversation.users.filter(
          (user) => user.id !== getUser().id
        )[0].profile_url,
      };

  return (
    <div className="p-2 shadow-xl shadow-primary-purple/5 bg-[#882A8508] flex items-center justify-between min-h-16">
      <div className="flex items-center gap-5">
        <button className="lg:hidden" onClick={() => navigate("/")}>
          {"<<"}
        </button>
        <img
          src={photoUrl || "/user.png"}
          alt=""
          className="w-12 h-12 rounded-full object-contain object-center"
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-bold">{name}</span>
        </div>
      </div>
      <div className="flex gap-5">
        <button onClick={startCall}>
          <img src="/call.png" alt="Call" className="w-5 h-5" />
        </button>
        <button onClick={() => setShowDetail((prev) => !prev)}>
          <img src="/info3.png" alt="" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
