import { useState, useEffect } from "react";
import Modal from "../../../components/common/Modal";
import { BiUserPlus, BiSearch } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const allUsers = [
  {
    id: "1",
    username: "John Doe",
    photoUrl: "",
    status: "online",
    mutualFriends: 3,
  },
  {
    id: "2",
    username: "Jane Smith",
    photoUrl: "",
    status: "offline",
    mutualFriends: 1,
  },
  {
    id: "3",
    username: "Alice Johnson",
    photoUrl: "",
    status: "online",
    mutualFriends: 2,
  },
  {
    id: "4",
    username: "Bob Brown",
    photoUrl: "",
    status: "offline",
    mutualFriends: 0,
  },
  {
    id: "5",
    username: "Emily White",
    photoUrl: "",
    status: "online",
    mutualFriends: 4,
  },
  // Add more users here
];

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddContactModal = ({ isOpen, onClose }: AddContactModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<typeof allUsers>(allUsers);
  const [addedContacts, setAddedContacts] = useState<typeof allUsers>([]);

  useEffect(() => {
    const filteredUsers = allUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !addedContacts.find((contact) => contact.id === user.id)
    );
    setResults(filteredUsers);
  }, [searchQuery, addedContacts]);

  const handleAddContact = (user: (typeof allUsers)[number]) => {
    if (addedContacts.find((contact) => contact.id === user.id)) {
      toast.warn("Already Added");
      return;
    }

    setAddedContacts((prev) => [...prev, user]);
    setResults((prev) => prev.filter((contact) => contact.id !== user.id));
    setSearchQuery("");
    toast.success(`${user.username} added to contacts`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Add New Contact
      </h2>
      <div className="flex items-center mb-4 bg-gray-100 rounded-xl px-4 py-2 shadow-inner">
        <BiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent outline-none text-gray-800 w-full"
        />
      </div>

      {results.length > 0 ? (
        <ul className="space-y-4 mt-2">
          {results.map((user) => (
            <li
              key={user.id}
              className="px-4 py-4 bg-gray-100 rounded-lg shadow-md flex items-center justify-between"
            >
              <div className="flex items-center">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.username}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <FaUserAlt className="text-gray-500 text-xl" />
                  </div>
                )}
                <div>
                  <span className="text-gray-800 font-semibold">
                    {user.username}
                  </span>
                  <p className="text-gray-500 text-sm">
                    {user.status} | {user.mutualFriends} Mutual Friends
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAddContact(user)}
                className="bg-primary-purple text-white p-2 rounded-md flex items-center"
              >
                <BiUserPlus className="text-xl" />
                <span className="ml-2">Add</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-4">No users found</p>
      )}
    </Modal>
  );
};

export default AddContactModal;
