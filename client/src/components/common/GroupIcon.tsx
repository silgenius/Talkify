import { MdOutlineGroup } from "react-icons/md";

const GroupIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={`${className} rounded-full w-20 h-20 flex items-center justify-center bg-gray-400 p-2`}
    >
      <MdOutlineGroup className="text-5xl text-white" />
    </div>
  );
};

export default GroupIcon;
