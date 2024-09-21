import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import SearchInput from "../../../components/common/SearchInput";
import NewContactModal from "./NewContactModal";
import { useQueryClient } from "@tanstack/react-query";
import { ContactType } from "../../../types";
import ContactCard from "./ContactCard";

const Contacts: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "accepted" | "requested" | "pending" | "blocked"
  >("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredContacts, setFilteredContacts] = useState<ContactType[]>([]);
  const queryClient = useQueryClient();
  const contacts = queryClient.getQueryData<ContactType[]>(["contacts"]);

  useEffect(() => {
    if (contacts) {
      setFilteredContacts(
        contacts.filter((contact) => {
          console.log(contact);

          const matchesSearch = contact.contact.username
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesTab =
            activeTab === "all"
              ? contact.status === "accepted"
              : contact.status === activeTab;
          return matchesSearch && matchesTab;
        })
      );
    }
  }, [contacts, setFilteredContacts, searchQuery, activeTab]);

  //console.log(filteredContacts);

  const tabcolors = {
    acitve: "text-primary-purple bg-primary-purple/20",
    inactive: "text-gray-500 bg-white",
  };

  return (
    <div className="flex flex-col h-full py-2">
      <header className="flex items-center justify-between mb-6 px-4">
        <h1 className="text-4xl font-bold text-gray-800">Contacts</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-purple text-white rounded-lg shadow-lg hover:bg-primary-dark"
        >
          <FaUserPlus size={20} />
          New Contact
        </button>
        {
          <NewContactModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        }
      </header>
      <div className="px-4">
        <SearchInput value={searchQuery} onInputChange={setSearchQuery} />
      </div>
      <div className="flex-1 overflow-y-auto h-full px-4">
        <nav className="mb-4 flex gap-4 text-nowrap overflow-x-auto">
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
              activeTab === "all" ? tabcolors.acitve : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
              activeTab === "accepted" ? tabcolors.acitve : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("accepted")}
          >
            Online
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
              activeTab === "pending" ? tabcolors.acitve : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
              activeTab === "requested" ? tabcolors.acitve : tabcolors.inactive
            }`}
            onClick={() => setActiveTab("requested")}
          >
            Friend Requests
          </button>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-4 overflow-y-auto">
          {filteredContacts?.length > 0 ? (
            filteredContacts.map((contact: ContactType) => (
              <ContactCard key={contact.contact.id} contact={contact} />
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

// const contacts = {
//   data: [
//     {
//       contact: {
//         id: "1",
//         username: "John Doe",
//         last_login: "now",
//         profile_url: "",
//       },
//       status: "online",
//       created_at: "now",
//     },
//     {
//       contact: {
//         id: "2",
//         username: "Jane Smith",
//         last_login: "now",
//         profile_url: "",
//       },
//       status: "pending",
//       created_at: "now",
//     },
//     {
//       contact: {
//         id: "3",
//         username: "Alice Johnson",
//         last_login: "now",
//         profile_url: "",
//       },
//       status: "requested",
//       created_at: "now",
//     },
//     {
//       contact: {
//         id: "4",
//         username: "Bob Brown",
//         last_login: "now",
//         profile_url: "",
//       },
//       status: "online",
//       created_at: "now",
//     },
//     {
//       contact: {
//         id: "5",
//         username: "Bob Brown",
//         last_login: "now",
//         profile_url: "",
//       },
//       status: "offline",
//       created_at: "now",
//     },
//     // Add more contacts here
//   ],
// };
