import { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import { toast } from "react-toastify";
import { BiUserPlus, BiSearch, BiTrash } from "react-icons/bi";

const contacts = [
  { id: "1", username: "John Doe", status: "online" },
  { id: "2", username: "Jane Smith", status: "pending" },
  { id: "3", username: "Alice Johnson", status: "blocked" },
  { id: "4", username: "Bob Brown", status: "online" },
  { id: "5", username: "Bob Smith", status: "offline" },
  // Add more contacts here
].filter(contact => contact.status !== "blocked" && contact.status !== "pending");

interface SearchModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const NewChatModal = ({ isModalOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [results, setResults] = useState<typeof contacts>(contacts);
  const [addedMembers, setAddedMembers] = useState<typeof contacts>([]);

  useEffect(() => {
    const filteredContacts = contacts.filter(contact =>
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()) && !addedMembers.find(member => member.id === contact.id)
    );
    setResults(filteredContacts);
  }, [searchQuery, addedMembers]);

  const handleAdd = (contact: (typeof contacts)[number]) => {
    if (addedMembers.find(member => member.id === contact.id)) {
      toast.warn("Already Added");
      return;
    }

    setAddedMembers(prev => [...prev, contact]);
    setResults(prev => prev.filter(member => member.id !== contact.id));
    setSearchQuery("");
    toast.success(`${contact.username} added`);
  };

  const handleRemove = (contact: (typeof contacts)[number]) => {
    setAddedMembers(prev => prev.filter(member => member.id !== contact.id));
    setResults(prev => [...prev, contact]);
    toast.info(`${contact.username} removed`);
  };

  const handleCreateGroup = () => {
    if (addedMembers.length === 0) {
      toast.error("Please add at least one member to the group");
      return;
    }

    const newGroupName = groupName.trim()
      ? groupName
      : `Group: ${addedMembers.map(user => user.username).join(", ")}`;
    setGroupName(newGroupName);

    // Here you would call your API to create the group
    // newRequest.post("/create-group", { groupName: newGroupName, members: addedMembers });

    toast.success(`Group "${newGroupName}" created successfully!`);
    onClose();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Create a Conversation
      </h2>
      {/* <div className="mb-4">
        <input
          type="text"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          placeholder="Enter group name"
          className="px-4 py-2 bg-gray-100 rounded-lg shadow-inner outline-none text-gray-800 w-full"
        />
      </div> */}
      <div className="flex flex-wrap items-center mb-4 bg-gray-100 rounded-xl px-4 py-2 shadow-inner">
        {addedMembers.map(member => (
          <span
            key={member.id}
            className="flex items-center bg-primary-purple text-white text-sm font-semibold mr-2 mb-2 px-3 py-1 rounded-full"
          >
            {member.username}
            <BiTrash
              className="ml-2 cursor-pointer text-red-300 hover:text-red-600"
              onClick={() => handleRemove(member)}
            />
          </span>
        ))}
        <div className="flex-grow">
          <div className="flex items-center">
            <BiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search for contacts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-gray-800 w-full"
            />
          </div>
        </div>
      </div>

      {results.length > 0 ? (
        <ul className="space-y-4 mt-2">
          {results.map(contact => (
            <li
              key={contact.id}
              className="px-4 py-2 bg-gray-100 rounded-lg shadow-md flex items-center justify-between cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <span className="text-gray-700 font-semibold">
                {contact.username}
              </span>
              <button
                onClick={() => handleAdd(contact)}
                className="bg-gray-300 p-2 rounded-md"
              >
                <BiUserPlus className="text-xl text-primary-purple" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-4">No contacts found</p>
      )}
      <div className="flex flex-col space-y-4 mt-6">
        <button
          onClick={handleCreateGroup}
          className="w-full px-4 py-2 bg-primary-purple text-white font-semibold rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-fuchsia-900"
        >
          Create Conversation
        </button>
      </div>
    </Modal>
  );
};

export default NewChatModal;
