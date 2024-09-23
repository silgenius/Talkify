import {
  MdDeleteOutline,
  MdVolumeOff,
  MdOutlineImage,
  MdBlock,
} from "react-icons/md";
import { ConversationType, MessageType, UserType } from "../../types";
import React, { useEffect } from "react";
import { BiExit, BiX } from "react-icons/bi";
import GroupIcon from "../common/GroupIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { SocketEvent } from "../../utils/socketEvents";
import socket from "../../socket";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/localStorage";
import { CgUnblock } from "react-icons/cg";
import { FaSpinner } from "react-icons/fa";
import useAppData from "../../hooks/useAppData";
import ModalManager from "./ModalManager";

type DetailsProps = {
  conversation?: ConversationType;
  user?: UserType;
  onClose: () => void;
};

const Details: React.FC<DetailsProps> = ({ conversation, user, onClose }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [isBlocked, setIsBlocked] = React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState({
    exit: false,
    block: false,
    unblock: false,
  });
  const { contacts } = useAppData();
  const contact = contacts.data?.find(
    (contact) => contact.contact.id === user?.id
  );

  useEffect(() => {
    setIsBlocked(contact?.status === "blocked");
  }, [contact]);

  const exitGroup = useMutation({
    mutationFn: async (data: { conversation_id: string; user_id: string }) => {
      const res = await newRequest.put(`/conversation/group/remove`, data);
      return res.data;
    },
    onSuccess: (data: MessageType) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversation?.id],
      });
      socket.emit(SocketEvent.SEND_MESSAGE, { message_id: data.id });
      toast.info("You have left the group " + conversation?.name);
      navigate("/");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Failed to leave the group");
    },
  });

  const blockUser = useMutation({
    mutationFn: async (data: { sender_id: string; receiver_id: string }) => {
      const res = (await newRequest.post(`/block`, data)).data;
      console.log(res);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversation?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["availableContacts"] });
      toast.info("User blocked successfully");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Failed to block user");
    },
  });

  const unblockUser = useMutation({
    mutationFn: async (data: { sender_id: string; receiver_id: string }) => {
      const res = (await newRequest.post(`/unblock`, data)).data;
      console.log(res);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["conversation", conversation?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["availableContacts"] });
      toast.info("User unblocked successfully");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Failed to unblock user");
    },
  });

  const handleExit = () => {
    if (!conversation) return;
    exitGroup.mutate({
      conversation_id: conversation?.id,
      user_id: currentUser.id,
    });
    setShowModal({ block: false, exit: false, unblock: false });
  };

  const handleBlock = () => {
    blockUser.mutate({
      sender_id: currentUser.id,
      receiver_id: user?.id as string,
    });
    setShowModal({ block: false, exit: false, unblock: false });
  };

  const handleUnblock = () => {
    unblockUser.mutate({
      sender_id: currentUser.id,
      receiver_id: user?.id as string,
    });
    setShowModal({ block: false, exit: false, unblock: false });
  };

  if (!conversation) {
    return;
  }
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
            src={user?.profile_url || "/user.png"}
            alt={`${conversation.name || "Conversation"} Avatar`}
            className="w-20 h-20 rounded-full object-contain"
          />
        )}
        <h1 className="text-lg text-gray-800 font-semibold">
          {conversation.group
            ? conversation.name
            : user?.username || "Unnamed Conversation"}
        </h1>
      </div>

      {/* Bio Section */}
      {user?.bio && !conversation.group && (
        <div className="flex flex-col p-4">
          <h2 className="text-md text-gray-700 font-semibold border-t pt-4">
            Bio
          </h2>
          <p className="text-gray-600 mt-2 text-start">{user.bio}</p>
        </div>
      )}
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
            <button className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
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
        </div>
        <div className="w-full flex flex-col space-y-2 mt-4 border-t pt-4">
          <button
            className="flex items-center justify-start px-4 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
            onClick={() => {
              /* Clear chat logic */
            }}
          >
            <MdDeleteOutline className="mr-2 text-lg" />
            <span>Delete Chat</span>
          </button>

          {conversation.group ? (
            <button
              className="flex items-center justify-start px-4 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
              onClick={() =>
                setShowModal({ block: false, exit: true, unblock: false })
              }
            >
              {exitGroup.isPending ? (
                <FaSpinner className="animate-spin mr-2  text-lg" />
              ) : (
                <BiExit className="mr-2 text-lg" />
              )}
              <span>Exit Group</span>
            </button>
          ) : (
            <button
              className="flex items-center justify-start px-4 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200"
              onClick={() =>
                setShowModal({
                  block: !isBlocked,
                  exit: false,
                  unblock: isBlocked,
                })
              }
            >
              {blockUser.isPending || unblockUser.isPending ? (
                <FaSpinner className="animate-spin mr-2 text-lg" />
              ) : !isBlocked ? (
                <MdBlock className="mr-2 text-lg" />
              ) : (
                <CgUnblock className="mr-2 text-lg" />
              )}
              <span>
                {!isBlocked ? "Block" : "Unblock"} {user?.username}
              </span>
            </button>
          )}
        </div>
      </div>
      <ModalManager
        showModal={showModal}
        onClose={() =>
          setShowModal({ block: false, exit: false, unblock: false })
        }
        onAction={
          showModal.exit
            ? handleExit
            : showModal.block
            ? handleBlock
            : handleUnblock
        }
        isLoading={
          exitGroup.isPending || blockUser.isPending || unblockUser.isPending
        }
      />
    </div>
  );
};

export default Details;
