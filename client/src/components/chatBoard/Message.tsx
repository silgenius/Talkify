import { getUser } from "../../utils/localStorage";
import { MessageType } from "../../types";
import emojiRegex from "emoji-regex";
import ReactTimeago from "react-timeago";
import { GoDotFill } from "react-icons/go";

interface MessageProps {
  message: MessageType;
  isFirst: boolean;
  isLast: boolean;
  username: string;
  photoUrl: string;
}
const Message = ({
  message,
  isFirst,
  isLast,
  username,
  photoUrl,
}: MessageProps) => {
  const currentUser = getUser();
  const isSender = message.sender_id === currentUser.id;

  function containsOnlyEmojis(str: string) {
    const regex = emojiRegex();
    const isEmoji = str.split(/\s+/).every((word) => word.match(regex));

    return isEmoji;
  }

  return (
    <div className={`relative ${isSender ? "self-end" : "self-start"}`}>
      <div className=" absolute -left-10 top-0">
        {!isSender && isFirst && (
          <img
            src={photoUrl || "/user.png"}
            alt=""
            className="w-8 h-8 rounded-full object-contain object-center"
          />
        )}
      </div>
      {!containsOnlyEmojis(message.message_text) ? (
        <div
          className={` flex flex-col ${
            isSender
              ? " bg-primary-purple text-slate-100 rounded-xl"
              : " bg-gray-100 text-slate-900 h-fit rounded-xl"
          }  max-w-xs break-words py-2 px-4
            ${
              isSender
                ? isFirst && isLast
                  ? "rounded-3xl"
                  : isFirst
                  ? " rounded-br-md"
                  : isLast
                  ? "rounded-tr-md"
                  : "rounded-r-md"
                : isFirst && isLast
                ? "rounded-3xl"
                : isFirst
                ? " rounded-bl-md"
                : isLast
                ? "rounded-tl-md"
                : "rounded-l-md"
            } `}
        >
          {message.message_text}
        </div>
      ) : (
        // TailwindCSS purge safelist
        // grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6
        <div
          className={`grid grid-cols-${
            message.message_text.length <= 12
              ? String(Math.floor(message.message_text.length / 2))
              : "6"
          }`}
        >
          {[...message.message_text].map((emoji, index) => (
            <p key={index} className="text-4xl my-0.5 -mx-0.5">
              {emoji}
            </p>
          ))}
        </div>
      )}
      {isLast && (
        <div className="flex items-center space-x-1 text-xs text-gray-500 p-0.5">
          <span>{isSender ? "you" : username}</span>
          <GoDotFill size={5} />
          <span>
            <ReactTimeago date={message.created_at} />
          </span>
        </div>
      )}
    </div>
  );
};

export default Message;
