import React, { useState } from "react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import SearchInput from "../../components/common/SearchInput";
import AddContactModal from "../conversations/components/AddContactModal";

const Contacts: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "online" | "pending" | "blocked" | "offline"
  >("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const contacts = [
    { id: 1, username: "John Doe", status: "online" },
    { id: 2, username: "Jane Smith", status: "pending" },
    { id: 3, username: "Alice Johnson", status: "blocked" },
    { id: 4, username: "Bob Brown", status: "online" },
    { id: 5, username: "Bob Brown", status: "offline" },
    // Add more contacts here
  ];

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = contact.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all"
        ? contact.status === "online" || contact.status === "offline"
        : contact.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col h-full py-2">
      <header className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-4xl font-bold text-gray-800">Contacts</h1>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-purple text-white rounded-lg shadow-lg hover:bg-primary-dark">
          <FaUserPlus size={20} />
          New Contact
        </button>
        {<AddContactModal isOpen={showModal} onClose={() => setShowModal(false)}/>}
      </header>
      <div className="px-4">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto h-full px-4">
        <nav className="mb-4 flex gap-4">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "all"
                ? "bg-primary-purple text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "online"
                ? "bg-primary-purple text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("online")}
          >
            Online
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "pending"
                ? "bg-primary-purple text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "blocked"
                ? "bg-primary-purple text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setActiveTab("blocked")}
          >
            Blocked
          </button>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-4 ">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-4 mb-4 p-3 rounded-lg hover:bg-gray-100"
              >
                <img src="/user.png" className="w-12 h-12 text-gray-700" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{contact.username}</h2>
                  <p className="text-gray-600">
                    {contact.status.charAt(0).toUpperCase() +
                      contact.status.slice(1)}
                  </p>
                </div>
                <button className="text-gray-500 hover:text-primary-purple">
                  <FaUserCheck size={20} />
                </button>
              </div>
            ))
          ) : (
            <p>No contacts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contacts;
