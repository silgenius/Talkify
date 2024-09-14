import { useState } from "react";
import SearchModal from "./SearchModal";

const EmptyChat = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="lg:flex flex-col items-center justify-center h-full text-center p-6 bg-white rounded-lg shadow-inner">
      <div className="mb-8">
        <img
          src="/empty-chat-white.png"
          alt="Empty Chat"
          className="w-48 h-48 mx-auto opacity-75 animate-pulse"
        />
      </div>
      <h1 className="text-3xl font-semibold text-gray-600 mb-4">
        No conversation selected
      </h1>
      <p className="text-lg text-gray-500">
        Select a conversation from the left to start chatting or create a new
        one.
      </p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 px-6 py-3 bg-primary-purple text-white font-bold rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl"
      >
        Start a New Conversation
      </button>

      {isModalOpen && (
        <SearchModal
          isModalOpen={isModalOpen}
          onClose={() => setIsModalOpen((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default EmptyChat;
