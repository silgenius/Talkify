import { MdDeleteOutline, MdVolumeOff, MdOutlineImage } from "react-icons/md";
import { ConversationType } from "../../types";
import React from "react";
import { BiX } from "react-icons/bi";
import { getChatName, getChatPhoto } from "../../utils/conversationData";
import { getUser } from "../../utils/localStorage";
import GroupIcon from "../common/GroupIcon";

type DetailsProps = {
  conversation?: ConversationType;
  onClose: () => void;
};

const Details: React.FC<DetailsProps> = ({ conversation, onClose }) => {
  if (!conversation) {
    return;
  }
  const currentUser = getUser();
  const photo = getChatPhoto(conversation, currentUser);
  return (
    <div className="flex flex-col h-full w-full bg-white p-4 relative">
      <button
        onClick={onClose}
        className="absolute p-1.5 rounded-full top-4 md:right-4 transition-all hover:bg-primary-purple/10 hover:text-primary-purple"
      >
        <BiX className="w-6 h-6" />
      </button>
      {/* Header */}
      <div className="flex flex-col items-center justify-center mt-8 space-y-4">
        {conversation.group ? (
          <GroupIcon />
        ) : (
          <img
            src={photo || "/user.png"}
            alt={`${conversation.name || "Conversation"} Avatar`}
            className="w-20 h-20 rounded-full object-contain"
          />
        )}
        <h1 className="text-lg font-semibold ml-4">
          {getChatName(conversation, currentUser) || "Unnamed Conversation"}
        </h1>
      </div>

      {/* Conversation Info */}
      <div className="flex flex-col items-center p-4 space-y-4">
        {/* Participants */}
        {conversation.group && (
          <div className="w-full flex flex-col items-start border-t pt-4">
            <h3 className="text-gray-700 font-semibold">Members</h3>
            <ul className="space-y-2 mt-2">
              {conversation.users.map((participant) => (
                <li
                  key={participant.id}
                  className="text-gray-600 flex items-center space-x-2"
                >
                  <img
                    src={participant.profile_url || "/user.png"}
                    alt={`${conversation.name || "Conversation"} Avatar`}
                    className="w-6 h-6 rounded-full object-contain"
                  />
                  <span>{participant.username}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Conversation Details */}
        <div className="w-full flex flex-col border-t pt-4">
          <p className="text-gray-600">
            Created on:{" "}
            {new Date(conversation.created_at + "Z").toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            Last active:{" "}
            {new Date(conversation.updated_at + "Z").toLocaleString()}
          </p>
        </div>

        {/* Shared Media and Files */}
        <div className="w-full flex flex-col border-t pt-4">
          <h3 className="text-gray-700 font-semibold">Shared Media</h3>
          <div className="flex items-center space-x-4 mt-2">
            <button className="flex items-center px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
              <MdOutlineImage className="mr-2 text-lg text-primary-purple" />
              <span>View Images</span>
            </button>
            {/* You can add more file types like documents or links */}
          </div>
        </div>

        {/* Conversation Options */}
        <div className="w-full flex flex-col space-y-4 mt-4 border-t pt-4">
          <button
            className="flex items-center justify-start px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={() => {
              /* Mute logic */
            }}
          >
            <MdVolumeOff className="mr-2 text-lg text-primary-purple" />
            <span>Mute Notifications</span>
          </button>

          <button
            className="flex items-center justify-start px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            onClick={() => {
              /* Clear chat logic */
            }}
          >
            <MdDeleteOutline className="mr-2 text-lg text-primary-purple" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
