import { useParams } from "react-router-dom";
import { useState } from "react";
import { ConversationType } from "../../../types";
import Skeleton from "../../../components/common/Skeleton";
import Error from "../../../components/common/Error";
import ConversationItem from "./ConversationItem";
import SearchModal from "./SearchModal";
import { UseQueryResult } from "@tanstack/react-query";
import SearchInput from "../../../components/common/SearchInput";

interface ConversationsProps {
  conversations: UseQueryResult<ConversationType[], Error>;
}

const Conversations = ({ conversations }: ConversationsProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { id } = useParams();

  // Filter conversations based on the search query
  const filteredConversations = conversations.data?.filter((conversation: ConversationType) => {
    const name = conversation.group ? conversation.name : conversation.others[0].username;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
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
      </header>
      <div className="px-4">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
            {filteredConversations?.map((conversation: ConversationType) => (
              <ConversationItem
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
              />
            ))}
          </>
        )}
        {isModalOpen && (
          <SearchModal
            isModalOpen={isModalOpen}
            onClose={() => setIsModalOpen((prev) => !prev)}
          />
        )}
      </div>
    </div>
  );
};

export default Conversations;
