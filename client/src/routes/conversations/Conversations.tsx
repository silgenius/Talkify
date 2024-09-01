import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../../utils/localStorage";
import newRequest from "../../utils/newRequest";
import Chat from "./Chat";
import { useEffect, useState } from "react";
import { ConversationType, MessageType } from "../../types";
import Detail from "../../components/detail/Detail";
import socket from "../../socket";
import { SocketEvent } from "../../utils/socketEvents";
import SideNav from "./components/SideNav";
import EmptyChat from "./components/EmptyChat";
import { toast } from "react-toastify";

const Conversations = () => {
  const [showDetail, setShowDetail] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const queryClient = useQueryClient();

  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (currentUser === null) {
      const timer = setTimeout(() => {
        toast.error("Please login to continue");
        navigate("/login");
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  // fetch all logged in user conversations
  const conversations = useQuery<ConversationType[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = (await newRequest.get(`/${currentUser.id}/conversations`))
        .data;
      return res.conversations;
    },
  });

  // Listen for new messages and update the conversations and messages query
  useEffect(() => {
    socket.on(SocketEvent.MESSAGE_SENT, (message: MessageType) => {
      const inConversation = conversations.data?.find(
        (conversation: ConversationType) =>
          conversation.id === message.conversation_id
      );
      if (inConversation) {
        console.log("recieved message", message);
        queryClient.invalidateQueries({
          queryKey: ["messages", message.conversation_id],
        });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    });

    return () => {
      socket.off(SocketEvent.MESSAGE_SENT);
    };
  }, [conversations, queryClient]);

  return (
    <div className="flex">
      <SideNav conversations={conversations} />
      <div
        className={` ${id ? "w-full" : "hidden"} ${
          showDetail ? "lg:w-2/4" : "lg:w-3/4"
        } lg:block`}
      >
        {id ? <Chat setShowDetail={setShowDetail} /> : <EmptyChat />}
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
