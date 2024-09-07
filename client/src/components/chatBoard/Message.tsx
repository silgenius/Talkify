import { getUser } from "../../utils/localStorage";
import { MessageType } from "../../types";
import emojiRegex from "emoji-regex";

interface MessageProps {
  message: MessageType;
  lastMessageRef: React.RefObject<HTMLDivElement> | null;
  isFirst: boolean;
  isLast: boolean;
}
const Message = ({ message, isFirst, isLast }: MessageProps) => {
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
          <img src="/user.png" alt="" className="w-8 h-8 rounded-full" />
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
      {/* <span className="text-xs">
        <TimeAgo date={message.created_at} />
      </span> */}
    </div>
  );
};

export default Message;
