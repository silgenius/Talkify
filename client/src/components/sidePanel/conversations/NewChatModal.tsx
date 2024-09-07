import { useState, useEffect } from "react";
import Modal from "../../common/Modal";
import { toast } from "react-toastify";
import { BsArrowLeft, BsArrowRightShort } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ContactCard from "./ContactCard";
import SearchInput from "../../common/SearchInput";
import NewChatDetails from "./GroupDetails";
import GroupMemberChip from "./GroupMemberChip";
import { getUser } from "../../../utils/localStorage";

const contacts = [
  { id: "1", username: "John Doe", bio: "Software Engineer" },
  { id: "2", username: "Jane Smith", bio: "Frontend Developer" },
  { id: "3", username: "Alice Johnson", bio: "Product Manager" },
  { id: "4", username: "Bob Brown", bio: "UI/UX Designer" },
  { id: "5", username: "Bob Smith", bio: "Full Stack Developer" },
  { id: "6", username: "Sarah Johnson", bio: "Backend Developer" },
  { id: "7", username: "Michael Smith", bio: "Data Scientist" },
  { id: "8", username: "Emily Davis", bio: "Mobile App Developer" },
  { id: "9", username: "David Wilson", bio: "DevOps Engineer" },
  { id: "10", username: "Olivia Brown", bio: "Software Tester" },
];

interface SearchModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const NewChatModal = ({ isModalOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<typeof contacts>(contacts);
  const [addedMembers, setAddedMembers] = useState<typeof contacts>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [groupDetails, setGroupDetails] = useState<{
    name: string;
    photo?: string;
  }>({
    name: "",
    photo: "",
  });
  const [currentStep, setCurrentStep] = useState<"members" | "details">(
    "members"
  );
  const navigate = useNavigate();
  useEffect(() => {
    const filteredContacts = contacts.filter(
      (contact) =>
        contact.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !addedMembers.find((member) => member.id === contact.id)
    );
    setResults(filteredContacts);
  }, [searchQuery, addedMembers]);

  const handleAdd = (contact: (typeof contacts)[number]) => {
    if (isGroup) {
      if (addedMembers.find((member) => member.id === contact.id)) {
        toast.warn("Already Added");
        return;
      }

      setAddedMembers((prev) => [...prev, contact]);
      setResults((prev) => prev.filter((member) => member.id !== contact.id));
      setSearchQuery("");
      toast.success(`${contact.username} added`);
    } else {
      // Here you would call your API to create a new chat
      // newRequest.post("/create-chat", { user: contact });
      const conversation = { id: "someid" };
      toast.success(`Chat with ${contact.username} created successfully!`);
      onClose();
      navigate(`/conversation/${conversation.id}`);
    }
  };

  const handleRemove = (contact: (typeof contacts)[number]) => {
    setAddedMembers((prev) =>
      prev.filter((member) => member.id !== contact.id)
    );
    setResults((prev) => [...prev, contact]);
    toast.info(`${contact.username} removed`);
  };

  const handleCreateGroup = () => {
    if (addedMembers.length === 0) {
      toast.error("Please add at least one member to the group");
      return;
    }

    // Here you would call your API to create the group
    // newRequest.post("/create-group", { groupName: newGroupName, members: addedMembers });

    toast.success(`Group "${groupDetails.name}" created successfully!`);
    setTimeout(() => {
      setAddedMembers([]);
      setGroupDetails({ name: "", photo: "" });
      setCurrentStep("members");
    }, 300);
    onClose();
  };
  const handleNext = () => {
    if (addedMembers.length === 0) {
      toast.error("Please add at least one member to the group");
      return;
    }
    const newGroupName = `${getUser().username}, ${
      addedMembers.length > 2
        ? addedMembers
            .splice(0, 2)
            .map((user) => user.username)
            .join(", ") + ", and others"
        : addedMembers.map((user) => user.username).join(", ")
    }`;
    setGroupDetails((prev) => ({ ...prev, name: newGroupName }));
    setCurrentStep("details");
  };
  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <div className="h-full flex flex-col items-stretch">
        <div className="relative flex items-center justify-center mb-4">
          {currentStep === "details" && (
            <button
              onClick={() => setCurrentStep("members")}
              className="absolute left-0 text-2xl"
            >
              <BsArrowLeft />
            </button>
          )}

          <h2 className="text-2xl font-bold text-gray-800">
            {!isGroup ? "New Chat" : "New Group"}
          </h2>
        </div>

        <div className="flex items-center justify-start mb-4 space-x-4">
          <button
            onClick={() => {
              setIsGroup(false);
              setAddedMembers([]);
              setCurrentStep("members");
            }}
            className={`font-bold py-2 px-4 rounded transition-colors ${
              isGroup
                ? "text-gray-500 bg-gray-100 hover:bg-gray-200"
                : "text-primary-purple bg-primary-purple/35"
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setIsGroup(true)}
            className={`font-bold py-2 px-4 rounded transition-colors ${
              !isGroup
                ? "text-gray-500 bg-gray-100 hover:bg-gray-200"
                : "text-primary-purple bg-primary-purple/35"
            }`}
          >
            Group
          </button>
        </div>
        {currentStep === "members" ? (
          <>
            <SearchInput
              placeholder="Search for contacts..."
              value={searchQuery}
              onInputChange={setSearchQuery}
              chips={addedMembers.map((member) => (
                <GroupMemberChip
                  key={member.id}
                  member={member}
                  onClick={handleRemove}
                />
              ))}
              isMulti={isGroup}
            />
            <label className="text-gray-600 text-sm font-medium">
              {isGroup ? "Add members" : "Select a contact to start a chat"}
            </label>
            <div className=" flex-1 overflow-y-auto -mx-6">
              {results.length > 0 ? (
                <ul className="mt-2  ">
                  {results.map((contact) => (
                    <ContactCard
                      contact={contact}
                      handleAdd={() => handleAdd(contact)}
                      isGroup={isGroup}
                    />
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 mt-4">
                  No contacts found
                </p>
              )}
            </div>
          </>
        ) : (
          <NewChatDetails
            groupDetails={groupDetails}
            setGroupDetails={setGroupDetails}
          />
        )}

        <div
          className={`flex-col space-y-4 mt-4 transition-all duration-300 ease-in-out overflow-hidden ${
            isGroup ? "flex max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <button
            onClick={currentStep === "members" ? handleNext : handleCreateGroup}
            className="w-full flex justify-center items-center px-4 py-2 space-x-2 bg-primary-purple text-white font-semibold rounded-lg shadow-lg transition-colors hover:bg-fuchsia-900"
            disabled={!isGroup}
          >
            <p>{currentStep === "members" ? "Next" : "Create Group"}</p>
            <BsArrowRightShort className="text-xl" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NewChatModal;
