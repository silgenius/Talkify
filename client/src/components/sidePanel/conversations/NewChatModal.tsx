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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { ContactType, ConversationType } from "../../../types";

interface SearchModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const NewChatModal = ({ isModalOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<ContactType[]>([]);
  const [addedMembers, setAddedMembers] = useState<ContactType[]>([]);
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
  const currentUser = getUser();
  const queryClient = useQueryClient();

  // Fetch all available contacts
  const { data: contacts } = useQuery<ContactType[]>({
    queryKey: ["availableContacts"],
    queryFn: async () => {
      const res = (await newRequest(`${currentUser.id}/contacts`)).data;
      //console.log(res);
      return res.contacts.filter(
        (contact: ContactType) =>
          contact.status === "accepted" || contact.status === "pending"
      );
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!contacts) return;

    const filteredContacts = contacts.filter(
      (contact) =>
        contact.contact.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !addedMembers.find((member) => member.contact.id === contact.contact.id)
    );
    setResults(filteredContacts);
  }, [searchQuery, addedMembers, contacts]);

  const createConversation = useMutation({
    mutationFn: async (data: { users: [string]; created_by: string }) => {
      const conversations = queryClient.getQueriesData({
        queryKey: ["conversations"],
      })[0][1] as ConversationType[];
      const existingConversation = conversations.find(
        (conversation) =>
          !conversation.group &&
          conversation.others.find((user) => user.id === data.users[0])
      );

      if (existingConversation) {
        return { id: existingConversation.id, new: false };
      }
      const res = (await newRequest.post("/conversations/create", data)).data;
      return { id: res.id, new: true };
    },
    onSuccess: (data) => {
      if (data.new) toast.success(`Chat created successfully!`);
      else toast.info(`Chat already exists!`);

      navigate(`/conversation/${data.id}`);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    },
  });

  const handleAdd = (contact: ContactType) => {
    if (isGroup) {
      if (
        addedMembers.find((member) => member.contact.id === contact.contact.id)
      ) {
        toast.warn("Already Added");
        return;
      }

      setAddedMembers((prev) => [...prev, contact]);
      setResults((prev) =>
        prev?.filter((member) => member.contact.id !== contact.contact.id)
      );
      setSearchQuery("");
      toast.success(`${contact.contact.username} added`);
    } else {
      createConversation.mutate({
        created_by: currentUser.id,
        users: [contact.contact.id],
      });
      onClose();
    }
  };

  const handleRemove = (contact: ContactType) => {
    setAddedMembers((prev) =>
      prev.filter((member) => member.contact.id !== contact.contact.id)
    );
    setResults((prev) => [...prev, contact]);
    toast.info(`${contact.contact.username} removed`);
  };

  const createGroup = useMutation({
    mutationFn: async (data: {
      created_by: string;
      name: string;
      photo?: string;
      users: string[];
    }) => {
      console.log("data", data);

      const res = (await newRequest.post("/conversations/create/group", data))
        .data;
      console.log(res);

      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.success(`Group "${data.name}" created successfully!`);
      navigate(`/conversation/${data.id}`);
      setTimeout(() => {
        setAddedMembers([]);
        setGroupDetails({ name: "", photo: "" });
        setCurrentStep("members");
      }, 300);
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    },
  });

  const handleCreateGroup = () => {
    if (addedMembers.length === 0) {
      toast.error("Please add at least one member to the group");
      return;
    }
    if (!groupDetails.name || groupDetails.name.trim() === "") {
      toast.warning("Please enter a valid group name");
      return;
    }
    if (groupDetails.name.length > 60) {
      toast.warning("Group name is too long");
      return;
    }

    createGroup.mutate({
      created_by: currentUser.id,
      photo: groupDetails.photo,
      name: groupDetails.name,
      users: [...addedMembers.map((member) => member.contact.id)],
    });
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
            .splice(0, 1)
            .map((user) => user.contact.username)
            .join(", ") + ", and others"
        : addedMembers.map((user) => user.contact.username).join(", ")
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
                  key={member.contact.id}
                  member={member}
                  onClick={handleRemove}
                />
              ))}
              isMulti={isGroup}
            />
            <label className="text-gray-600 text-sm font-medium text-start">
              {isGroup ? "Add members" : "Select a contact to start a chat"}
            </label>
            <div className=" flex-1 overflow-y-auto -mx-6">
              {results.length > 0 ? (
                <ul className="mt-2  ">
                  {results.map((contact) => (
                    <ContactCard
                      key={contact.contact.id}
                      contact={contact.contact}
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
