import { BiX } from "react-icons/bi";

type MemberType = {
  id: string;
  username: string;
  bio: string;
};

interface GroupMemberChipProps {
  member: MemberType;
  onClick: (member: MemberType) => void;
}

const GroupMemberChip = ({ member, onClick }: GroupMemberChipProps) => {
  return (
    <span className="flex items-center bg-primary-purple text-white text-sm font-semibold mr-2 mb-2 px-3 py-1 rounded-full">
      {member.username}
      <BiX
        className="ml-2 cursor-pointer text-red-300 hover:text-red-600"
        onClick={() => onClick(member)}
      />
    </span>
  );
};

export default GroupMemberChip;
