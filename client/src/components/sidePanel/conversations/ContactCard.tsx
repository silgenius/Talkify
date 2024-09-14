import { BsArrowRightShort } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";

interface ContactCardProps {
  contact: {
    id: string;
    username: string;
    profile_url?: string;
    last_login: string;
  };
  isGroup: boolean;
  handleAdd: () => void;
}

const ContactCard = ({ contact, isGroup, handleAdd }: ContactCardProps) => {
  return (
    <li
      key={contact.id}
      className="px-6 py-4 border-b border-gray-300 bg-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-200"
      onClick={handleAdd}
    >
      <div className="flex items-center">
        {contact.profile_url ? (
          <img
            src={contact.profile_url}
            alt={contact.username}
            className="w-12 h-12 rounded-full object-contain object-center mr-4"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
            <FaUserAlt className="text-gray-500 text-xl" />
          </div>
        )}
        <div>
          <span className="text-gray-800 font-semibold">
            {contact.username}
          </span>
          <p className="text-gray-500 text-sm">
            {contact.last_login ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {!isGroup && <BsArrowRightShort className="text-xl" />}
    </li>
  );
};

export default ContactCard;
