import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ChatListItem from "./components/ChatListItem";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../utils/localStorage";
import newRequest from "../../utils/newRequest";
import { talkifyLogo } from "../../assets";
import Chat from "./Chat";
import { useEffect } from "react";

type Conversation = {
  id: string;
  name: string;
  last_message_id: string;
  group: boolean;
  create_at: string;
  updated_at: string;
};

const Conversations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();

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
      console.log(res);
      return res.conversations;
    },
  });
  return (
    <div className="flex space-x-4">
      <div className="flex-1 h-screen overflow-y-scroll bg-[#F1F2F6] w-1/4">
        <div className="flex flex-col items-start mb-1.5">
          <div className="flex items-center justify-between w-full px-4">
            <img
              src={talkifyLogo}
              alt="Talkify Logo"
              className="w-20 h-20 object-contain cursor-pointer"
              onClick={() => navigate("/")}
            />
            <div className="flex items-center justify-center w-6 h-6 ml-30 bg-[#882A85] rounded-full cursor-pointer">
              <img src="/plus.png" alt="" className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#333333] mt-0.5 px-4">Chats</p>
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
        {conversations?.data?.map((conversation: Conversation) => (
          <ChatListItem
            key={conversation.id}
            name={conversation.name}
            lastMessageId={conversation.last_message_id}
            conversationId={conversation.id}
            selected={id === conversation.id}
          />
        ))}
      </div>
      <div className="w-3/4">
        {id ? (
          <Chat
            name={
              conversations.data?.find(
                (conversation: Conversation) => conversation.id == id
              ).name
            }
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl text-gray-400">Select a conversation</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
