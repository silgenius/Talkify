import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ChatListItem from "./components/ChatListItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../../utils/localStorage";
import newRequest from "../../utils/newRequest";
import { talkifyLogo } from "../../assets";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import { ConversationType, MessageType } from "../../types";
import Detail from "../../components/detail/Detail";
import socket from "../../utils/socket";
import { SocketEvent } from "../../utils/socketEvents";

const Conversations = () => {
  const [showDetail, setShowDetail] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentUser === null) {
      const timer = setTimeout(() => {
        alert("Please login to continue");
        navigate("/login");
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  const conversations = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = (await newRequest.get(`/${currentUser.id}/conversations`))
        .data;
      //console.log(res);
      return res.conversations;
    },
  });

  useEffect(() => {
    socket.on(SocketEvent.MESSAGE_SENT, (message: MessageType) => {
      

      const inConversation = conversations.data.find(
        (conversation: ConversationType) =>
          conversation.id === message.conversation_id
      );
      if (inConversation) {
        console.log("recieves message", message);
        queryClient.invalidateQueries({ queryKey: ['messages', message.conversation_id] });
        queryClient.invalidateQueries({queryKey: ['conversations']});
      }
    });

    return () => {
      socket.off(SocketEvent.MESSAGE_SENT);
    };
  }, [conversations, queryClient]);

  return (
    <div className="flex space-x-4">
      <div className={`flex-1 h-screen overflow-y-scroll bg-[#F1F2F6] w-1/4`}>
        <div className="flex flex-col items-start mb-1.5">
          <div className="flex items-center justify-between w-full px-4">
            <img
              src={talkifyLogo}
              alt="Talkify Logo"
              className="w-20 h-20 object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
            <div>
              <img
                src="/setting.png"
                alt="Settings"
                className="w-5 h-5 cursor-pointer"
                onClick={() => navigate("/settings")}
              />
            </div>
          </div>
          <div className="flex items-center justify-between w-full px-4">
            <p className="text-3xl font-bold text-[#333333] mt-0.5">Chats</p>
            <div className="flex items-center justify-center w-6 h-6 ml-30 bg-[#882A85] rounded-full cursor-pointer">
              <img src="/plus.png" alt="" className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 p-5 w-full">
          <div className="flex-1 bg-[#a0a2aa44] flex items-center gap-5 rounded-full px-1 w-full">
            <img src="/searchblack.png" alt="" className="w-3 h-3" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none text-black flex-1"
            />
          </div>
        </div>
        {conversations?.data?.map((conversation: ConversationType) => (
          <ChatListItem
            key={conversation.id}
            name={
              conversation.group
                ? conversation.name
                : conversation.others[0].username
            }
            lastMessageId={conversation.last_message_id}
            conversationId={conversation.id}
            selected={id === conversation.id}
          />
        ))}
      </div>
      <div
        className={` ${id ? "w-full" : "hidden"} ${
          showDetail ? "lg:w-2/4" : "lg:w-3/4"
        } lg:block`}
      >
        {id ? (
          <Chat
            setShowDetail={setShowDetail}
            conversation={conversations.data?.find(
              (conversation: ConversationType) => conversation.id == id
            )}
          />
        ) : (
          <div className={`lg:flex items-center justify-center h-full`}>
            <h1 className="text-2xl text-gray-400">Select a conversation</h1>
          </div>
        )}
      </div>
      {showDetail && (
        <div className="w-1/4">
          <Detail />
        </div>
      )}
    </div>
  );
};

export default Conversations;
