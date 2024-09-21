import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { talkifyLogo } from "../../assets";
import { MdContacts, MdOutlineContacts } from "react-icons/md";
import {
  IoChatbox,
  IoChatboxOutline,
  IoSettingsOutline,
  IoSettingsSharp,
} from "react-icons/io5";
import newRequest from "../../utils/newRequest";
import { getUser } from "../../utils/localStorage";
import socket from "../../socket";
import { SocketEvent } from "../../utils/socketEvents";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContactType, ConversationType, MessageType } from "../../types";
import Conversations from "../../components/sidePanel/conversations/Conversations";
import Contacts from "../../components/sidePanel/contacts/Contacts";
import Settings from "../../components/sidePanel/settings/Settings";

const SidePanel = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const queryClient = useQueryClient();
  const currentUser = getUser();

  const [underlineWidth, setUnderlineWidth] = useState(0);
  const [underlinePosition, setUnderlinePosition] = useState(0);
  const contactsRef = useRef<HTMLButtonElement>(null);
  const chatsRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLButtonElement>(null);

  // fetch all logged in user conversations
  const conversations = useQuery<ConversationType[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = (await newRequest.get(`/${currentUser.id}/conversations`))
        .data;
      return res.conversations;
    },
  });

  useQuery<ContactType[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = (await newRequest(`${currentUser.id}/contacts`)).data;
      console.log("contacts", res);
      return res.contacts;
    },
  });

  useEffect(() => {
    if (conversations.isError) {
      toast.error("An error occurred. Please try again later");
    }
  }, [conversations.isError]);

  // Listen for new messages and update the conversations and messages query
  useEffect(() => {
    socket.on(SocketEvent.MESSAGE_SENT, (message: MessageType) => {
      const inConversation = conversations.data?.find(
        (conversation: ConversationType) =>
          conversation.id === message.conversation_id
      );
      if (inConversation) {
        console.log("received message", message);
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

  useEffect(() => {
    if (hash.includes("#contacts")) {
      if (contactsRef.current) {
        setUnderlineWidth(contactsRef.current.offsetWidth);
        setUnderlinePosition(contactsRef.current.offsetLeft);
      }
    } else if (hash.includes("#settings")) {
      if (settingsRef.current) {
        setUnderlineWidth(settingsRef.current.offsetWidth);
        setUnderlinePosition(settingsRef.current.offsetLeft);
      }
    } else {
      if (chatsRef.current) {
        setUnderlineWidth(chatsRef.current.offsetWidth);
        setUnderlinePosition(chatsRef.current.offsetLeft);
      }
    }
  }, [hash]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <div className="flex flex-col items-start mb-1.5">
          {/* Navigation to Contacts Page */}
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-between border-primary-purple/20 px-4 w-full py-2 shadow-md bg-inherit shadow-primary-purple/5 relative min-h-[4.5rem] ">
              <img
                src={talkifyLogo}
                alt="Talkify Logo"
                className="w-20 object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
              <div>
                <button
                  ref={chatsRef}
                  onClick={() => navigate(window.location.pathname)}
                  className={`py-2 px-4 rounded-lg transition duration-300 text-primary-purple hover:bg-primary-purple/10`}
                >
                  {!hash ? (
                    <IoChatbox className="inline-block text-3xl" />
                  ) : (
                    <IoChatboxOutline className="inline-block text-3xl" />
                  )}
                </button>
                <button
                  ref={contactsRef}
                  onClick={() => navigate("#contacts")}
                  className={`py-2 px-4 rounded-lg transition duration-300 text-primary-purple hover:bg-primary-purple/10`}
                >
                  {hash.includes("#contacts") ? (
                    <MdContacts className="inline-block text-3xl" />
                  ) : (
                    <MdOutlineContacts className="inline-block text-3xl" />
                  )}
                </button>
                <button
                  ref={settingsRef}
                  onClick={() => navigate("#settings")}
                  className={`py-2 px-4 rounded-lg transition duration-300 text-primary-purple hover:bg-primary-purple/10`}
                >
                  {hash.includes("#settings") ? (
                    <IoSettingsSharp className="inline-block text-3xl" />
                  ) : (
                    <IoSettingsOutline className="inline-block text-3xl" />
                  )}
                </button>
              </div>

              <div
                className={`absolute bottom-0 left-0 h-1 bg-primary-purple transition-all duration-300`}
                style={{
                  width: underlineWidth,
                  left: underlinePosition,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {hash.includes("#contacts") ? (
          <Contacts />
        ) : hash.includes("#settings") ? (
          <Settings />
        ) : (
          <Conversations conversations={conversations} />
        )}
      </div>
    </div>
  );
};

export default SidePanel;
