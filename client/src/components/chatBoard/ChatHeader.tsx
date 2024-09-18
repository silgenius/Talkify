import { useNavigate } from "react-router-dom";
import { ConversationType } from "../../types";
import { getUser } from "../../utils/localStorage";
import { BiArrowBack } from "react-icons/bi";
import { getChatName, getChatPhoto } from "../../utils/conversationData";
import { IoInformationCircleOutline } from "react-icons/io5";
import { LuPhoneCall } from "react-icons/lu";
import GroupIcon from "../common/GroupIcon";

interface ChatHeaderProps {
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
  conversation?: ConversationType;
  startCall: () => void;
  isLoading: boolean;
}

const ChatHeader = ({
  setShowDetail,
  conversation,
  startCall,
}: ChatHeaderProps) => {
  const navigate = useNavigate();
  const currentUser = getUser();

  const { name, photoUrl } = {
    name: getChatName(conversation, currentUser),
    photoUrl: getChatPhoto(conversation, currentUser),
  };

  return (
    <div className="p-2 px-4 shadow-md border-primary-purple/20 shadow-primary-purple/5 flex items-center justify-between min-h-[4.5rem]">
      <div className="flex items-center gap-5">
        <button
          className="lg:hidden p-1.5 rounded-full top-4 right-4 transition-all hover:bg-primary-purple/10 hover:text-primary-purple"
          onClick={() => navigate("/")}
        >
          <BiArrowBack size={24} />
        </button>
        {conversation?.group ? (
          <GroupIcon className="!w-12 !h-12" />
        ) : (
          <img
            src={photoUrl || "/user.png"}
            alt=""
            className="w-12 h-12 rounded-full object-contain object-center"
          />
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-bold">
            {name || (
              <div className="w-20 h-3 bg-gray-300 rounded animate-pulse" />
            )}
          </span>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          className="p-1.5 rounded-full top-4 right-4 transition-all hover:bg-primary-purple/5 hover:text-primary-purple"
          onClick={startCall}
        >
          <LuPhoneCall size={24} />
        </button>
        <button
          className="p-1.5 rounded-full top-4 right-4 transition-all hover:bg-primary-purple/5 hover:text-primary-purple"
          onClick={() => setShowDetail((prev) => !prev)}
        >
          <IoInformationCircleOutline size={28} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
