import { useState } from "react";
import Modal from "../../../components/common/Modal";
import { BiUserPlus, BiSearch } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { ContactAction, UserType } from "../../../types";
import { toast } from "react-toastify";
import { getUser } from "../../../utils/localStorage";
import { FaEllipsisV } from "react-icons/fa";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { IoPaperPlane } from "react-icons/io5";
import { ImBlocked } from "react-icons/im";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewContactModal = ({ isOpen, onClose }: AddContactModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<UserType[]>();
  const currentUser = getUser();

  const getContact = useMutation({
    mutationFn: async (data: string) => {
      const res = (await newRequest.get(`/user?search=${data}`)).data;
      console.log(res);
      return res.filter((user: UserType) => user.id !== currentUser.id);
    },
    onSuccess: (data) => {
      setContacts(data);
    },
    onError: () => {
      toast.error("User not found");
    },
  });

  const sendRequest = useMutation({
    mutationFn: async (data: ContactAction) => {
      const res = (await newRequest.post("/request", data)).data;
      console.log(res);
      return res;
    },
    onSuccess: () => {
      toast.success("Friend request sent");
      //setContacts([]);
    },
    onError: () => {
      toast.error("Failed to send friend request");
    },
  });

  const handleSearch = () => {
    getContact.mutate(searchQuery);
  };

  const handleSendRequest = (contact: UserType) => {
    if (contact)
      sendRequest.mutate({
        sender_id: currentUser.id,
        receiver_id: contact.id,
      });
    else toast.error("Failed to send friend request");
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
        <button
          onClick={handleSearch}
          className="bg-gray-300 px-2 p-1 rounded-md transition-all hover:bg-gray-400"
        >
          search
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 ">
        {contacts && contacts?.length > 0 ? (
          contacts?.map((contact) => (
            <div className="px-4 py-4 bg-gray-100 rounded-lg shadow flex items-center justify-between">
              <div className="relative flex items-center">
                <Menu
                  position="anchor"
                  transition
                  menuButton={
                    <button className="text-gray-500 p-2 rounded-full hover:bg-gray-300">
                      <FaEllipsisV />
                    </button>
                  }
                  className="right-0"
                >
                  <MenuItem className="flex items-center space-x-2">
                    <IoPaperPlane />
                    <p>Send a dm</p>
                  </MenuItem>
                  <MenuItem className="flex items-center space-x-2">
                    <ImBlocked />
                    <p>Block</p>
                  </MenuItem>
                </Menu>
                <img
                  src={contact.profile_url || "/user.png"}
                  alt={contact.username}
                  className="w-12 h-12 rounded-full mr-4 object-contain object-center"
                />

                <div>
                  <span className="text-gray-800 font-semibold">
                    {contact.username}
                  </span>
                  <p className="text-gray-500 text-sm">{contact.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleSendRequest(contact)}
                className="bg-primary-purple text-white p-2 rounded-md flex items-center"
              >
                <BiUserPlus className="text-xl" />
                <span className="ml-2">Add Friend</span>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No users found</p>
        )}
      </div>
    </Modal>
  );
};

export default NewContactModal;
