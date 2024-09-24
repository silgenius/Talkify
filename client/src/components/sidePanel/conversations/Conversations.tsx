import { useParams } from "react-router-dom";
import { useState } from "react";
import { ConversationType } from "../../../types";
import Skeleton from "../../common/Skeleton";
import Error from "../../common/Error";
import ConversationItem from "./ConversationItem";
import { UseQueryResult } from "@tanstack/react-query";
import SearchInput from "../../common/SearchInput";
import NewChatModal from "./NewChatModal";
import { FiMessageSquare } from "react-icons/fi";

interface ConversationsProps {
  conversations: UseQueryResult<ConversationType[], Error>;
}

const Conversations = ({ conversations }: ConversationsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { id } = useParams();

  // Filter conversations based on the search query
  const filteredConversations = conversations.data
    ?.filter((conversation: ConversationType) => {
      const name = conversation.group
        ? conversation.name
        : conversation.others[0].username;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      if (a.updated_at && b.updated_at) {
        return a.updated_at > b.updated_at ? -1 : 1;
      }
      if (a.updated_at) return -1;
      if (b.updated_at) return 1;
      return 0;
    });

  return (
    <div className="flex flex-col h-full py-2">
      <header className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-4xl font-bold text-gray-800">Chats</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-2 py-2 bg-primary-purple text-white rounded-full shadow-lg hover:bg-primary-dark"
        >
          <img src="/plus.png" alt="New Chat" className="w-4 h-4" />
        </button>
        <NewChatModal
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </header>
      <div className="px-4">
        <SearchInput value={searchQuery} onInputChange={setSearchQuery} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.isLoading ? (
          <>
            <Skeleton />
            <Skeleton />
          </>
        ) : (
          <>
            {conversations.isError && <Error />}
            {filteredConversations && filteredConversations?.length > 0 ? (
              filteredConversations?.map((conversation: ConversationType) => (
                <ConversationItem
                  contactId={
                    conversation.group ? undefined : conversation.others[0].id
                  }
                  key={conversation.id}
                  name={
                    conversation.group
                      ? conversation.name
                      : conversation.others[0].username
                  }
                  lastMessageId={conversation.last_message_id}
                  conversationId={conversation.id}
                  selected={id === conversation.id}
                  isGroup={conversation.group}
                  photoUrl={
                    !conversation.group
                      ? conversation.others[0].profile_url
                      : undefined
                  }
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-gray-500">
                <FiMessageSquare className="w-20 h-20 mb-4 text-gray-400" />{" "}
                {/* Using an icon */}
                <h2 className="text-xl font-bold">No Conversations Found</h2>
                <p className="text-sm">
                  Start a new chat or search for a contact to begin a
                  conversation.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Conversations;
