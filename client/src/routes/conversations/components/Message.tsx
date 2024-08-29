import { MessageType } from "../../../types";
import { getUser } from "../../../utils/localStorage";

interface MessageProps {
  message: MessageType;
}
const Message = ({ message }: MessageProps) => {
  const currentUser = getUser();
  const own = message.sender_id === currentUser.id;

  return (
    <div className={`flex gap-4 w-fit max-w-[70%] ${own && 'self-end'}`}>
      {!own && (
        <img src="/user.png" alt="" className="w-8 h-8 rounded-full" />
      )}
      <div className="flex-1 flex flex-col gap-1">
        <p
          className={`${
            own ? "bg-primary-purple text-white" : "bg-[#1f163d08] text-black"
          } p-3 rounded-xl`}
        >
          {message.message_text}
        </p>
        <span className="text-xs">1 min ago</span>
      </div>
    </div>
  );
};

export default Message;
