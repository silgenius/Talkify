import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactAction, ContactType } from "../../../types";
import { BiUserCheck, BiX, BiBlock } from "react-icons/bi";
import { FaCircle } from "react-icons/fa";
import newRequest from "../../../utils/newRequest";
import { getUser } from "../../../utils/localStorage";
import { toast } from "react-toastify";

interface ContactCardProps {
  contact: ContactType;
}

const ContactCard = ({ contact }: ContactCardProps) => {
  const currentUser = getUser();
  const isOnline = true;
  const queryClient = useQueryClient();

  const acceptRequest = useMutation({
    mutationFn: async (data: ContactAction) => {
      console.log(data);

      const res = await newRequest.post("/accept", data);
      console.log(res.data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Friend request accepted");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: () => {
      toast.error("Failed to accept friend request");
    },
  });

  const handleAcceptRequest = () => {
    acceptRequest.mutate({
      sender_id: currentUser.id,
      receiver_id: contact.contact.id,
    });
  };

  const handleRejectRequest = () => {};
  const handleCancelRequest = () => {};

  const renderStatusContent = () => {
    switch (contact.status) {
      case "requested":
        return (
          <>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {contact.contact.username}
              </h2>
              <p className="text-gray-600 text-sm">Sent you a friend request</p>
            </div>
            <div className="space-x-1">
              <button
                onClick={handleRejectRequest}
                className="text-gray-500 p-2 rounded-md hover:bg-red-100 hover:text-red-600"
              >
                <BiX size={20} />
              </button>
              <button
                onClick={handleAcceptRequest}
                className="text-gray-500 p-2 rounded-md hover:bg-primary-purple/10 hover:text-primary-purple"
              >
                <BiUserCheck size={20} />
              </button>
            </div>
          </>
        );
      case "pending":
        return (
          <>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {contact.contact.username}
              </h2>
              <p className="text-gray-600 text-sm">Friend request pending</p>
            </div>
            <div className="space-x-1">
              <button
                onClick={handleCancelRequest}
                className="text-gray-500 p-2 rounded-md hover:bg-red-100 hover:text-red-600"
              >
                <BiX size={20} />
              </button>
            </div>
          </>
        );
      case "blocked":
        return (
          <>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {contact.contact.username}
              </h2>
              <p className="text-gray-600 text-sm">Blocked</p>
            </div>
            <div className="space-x-1">
              <button className="text-gray-500 p-2 rounded-md hover:bg-red-100 hover:text-red-600">
                <BiBlock size={20} />
              </button>
            </div>
          </>
        );
      case "accepted":
        return (
          <>
            {isOnline ? (
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {contact.contact.username}
                </h2>
                <p className="text-green-500 text-sm flex items-center">
                  <FaCircle className="mr-1" size={8} /> Online
                </p>
              </div>
            ) : (
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {contact.contact.username}
                </h2>
                <p className="text-gray-500 text-sm flex items-center">
                  <FaCircle className="mr-1" size={8} /> Offline
                </p>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      key={contact.contact.id}
      className="flex items-center gap-4 mb-4 p-3 rounded-lg hover:bg-gray-100"
    >
      <img
        src={contact.contact.profile_url || "/user.png"}
        className="w-12 h-12 text-gray-700 rounded-full object-contain object-center"
      />

      {renderStatusContent()}
    </div>
  );
};

export default ContactCard;
