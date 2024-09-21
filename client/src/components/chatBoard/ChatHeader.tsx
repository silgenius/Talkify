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
      <div className="flex items-center gap-1 sm:gap-5">
        <button
          className="lg:hidden p-1.5 rounded-full top-4 right-4 transition-all hover:bg-primary-purple/10 hover:text-primary-purple"
          onClick={() => navigate("/")}
        >
          <BiArrowBack className="text-xl xs:text-2xl" />
        </button>
        <div
          onClick={() => setShowDetail((prev) => !prev)}
          className="flex items-center gap-2 xs:gap-5 hover:cursor-pointer"
        >
          {conversation?.group ? (
            <GroupIcon className="!w-10 !h-10 xs:!w-12 xs:!h-12" />
          ) : (
            <img
              src={photoUrl || "/user.png"}
              alt=""
              className="!w-10 !h-10 xs:!w-12 xs:!h-12 rounded-full object-contain object-center"
            />
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-md xs:text-lg font-bold">
              {name || (
                <div className="w-20 h-3 bg-gray-300 rounded animate-pulse" />
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-4 text-gray-800">
        <button
          className="p-1.5 rounded-full top-4 right-4 transition-all hover:bg-primary-purple/5 hover:text-primary-purple"
          onClick={startCall}
        >
          <LuPhoneCall className="text-xl xs:text-2xl" />
        </button>
        <button
          className="p-1.5 rounded-full top-4 right-4 transition-all hover:bg-primary-purple/5 hover:text-primary-purple hidden xs:block"
          onClick={() => setShowDetail((prev) => !prev)}
        >
          <IoInformationCircleOutline className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
