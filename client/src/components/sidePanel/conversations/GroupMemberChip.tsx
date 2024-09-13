import { BiX } from "react-icons/bi";
import { ContactType } from "../../../types";

interface GroupMemberChipProps {
  member: ContactType;
  onClick: (member: ContactType) => void;
}

const GroupMemberChip = ({ member, onClick }: GroupMemberChipProps) => {
  return (
    <span className="flex items-center bg-primary-purple text-white text-sm font-semibold mr-2 mb-2 px-3 py-1 rounded-full">
      {member.contact.username}
      <BiX
        className="ml-2 cursor-pointer text-red-300 hover:text-red-600"
        onClick={() => onClick(member)}
      />
    </span>
  );
};

export default GroupMemberChip;
