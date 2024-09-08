import React from "react";
import { FaUserAlt } from "react-icons/fa";

interface GroupDetailsProps {
  groupDetails: {
    name: string;
    photo?: string;
  };
  setGroupDetails: React.Dispatch<
    React.SetStateAction<{ name: string; photo?: string }>
  >;
}
const GroupDetails = ({ groupDetails, setGroupDetails }: GroupDetailsProps) => {
  return (
    <div className="space-y-6 p-6 max-w-lg mx-auto w-full flex flex-col flex-1">
      {/* Group Photo Input */}
      <div className="flex flex-col items-center mb-6 ">
        <label className="relative flex flex-col items-center justify-center w-32 h-32 bg-gray-200 text-blue-600 rounded-full shadow-md cursor-pointer hover:bg-blue-300 transition-colors duration-200 ease-in-out">
          {groupDetails.photo ? (
            <img src={groupDetails.photo} />
          ) : (
            <FaUserAlt className="text-4xl" />
          )}
          <input
            type="file"
            onChange={(e) =>
              setGroupDetails((prev) => ({
                ...prev,
                photo: e.target.files?.[0].name || "",
              }))
            }
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
        <span className="mt-2 text-gray-600 text-sm">Add Photo</span>
      </div>

      {/* Group Name */}
      <div className="mb-4">
        <label
          htmlFor="groupName"
          className="block text-gray-700 font-medium mb-1"
        >
          Group Name
        </label>

        <input
          type="text"
          value={groupDetails.name}
          onChange={(e) =>
            setGroupDetails((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Enter group name"
          className="px-4 py-2 bg-gray-100 rounded-lg shadow-inner outline-none text-gray-800 w-full"
        />
      </div>

      {/* Create Group Button */}
    </div>
  );
};

export default GroupDetails;
