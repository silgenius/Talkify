import { getUser } from "../../utils/localStorage";
import { MessageType } from "../../types";
import emojiRegex from "emoji-regex";
import { GoDotFill } from "react-icons/go";
import { BiCheck, BiCheckDouble } from "react-icons/bi";
import { useEffect } from "react";
import socket from "../../socket";
import { SocketEvent } from "../../utils/socketEvents";

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

  useEffect(() => {
    if (!isSender && message.status !== "seen") {
      console.log("read message", message.message_text);
      socket.emit(SocketEvent.READ_MESSAGE, { message_id: message.id });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`relative flex flex-col w-full ${
        isSender ? "self-end items-end" : "self-start items-start"
      }`}
    >
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
          className={`flex flex-col   ${
            isSender
              ? " bg-primary-purple text-gray-50 rounded-xl shadow-sm shadow-primary-purple/40"
              : " bg-gray-100 text-gray-800 h-fit rounded-xl shadow-inner"
          }  break-words py-2 px-4 max-w-[80%]
            ${
              isSender
                ? isFirst && isLast
                  ? "rounded-xl"
                  : isFirst
                  ? " rounded-br"
                  : isLast
                  ? "rounded-tr"
                  : "rounded-r"
                : isFirst && isLast
                ? "rounded-xl"
                : isFirst
                ? " rounded-bl"
                : isLast
                ? "rounded-tl"
                : "rounded-l"
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
        <div
          className={`flex items-center space-x-1 text-xs text-gray-500 p-0.5 ${
            isSender ? "self-end" : "self-start"
          }`}
        >
          {!isSender && (
            <>
              <span>{username}</span>
              <GoDotFill size={5} />
            </>
          )}
          <span>
            {new Date(message.created_at).toLocaleString("en-UK", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {isSender && (
            <div className="flex space-x-0.5">
              {message.status === "sent" ? (
                <BiCheck size={16} />
              ) : (
                <BiCheckDouble
                  className={`${
                    message.status === "seen" ? "text-primary-purple" : ""
                  }`}
                  size={16}
                />
              )}
              <span>{message.status}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
