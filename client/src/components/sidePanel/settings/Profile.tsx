import { IoLogOutOutline } from "react-icons/io5";
import { getUser, setUser } from "../../../utils/localStorage";
import { FiEdit3 } from "react-icons/fi";
import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { FaCheck, FaSpinner } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { toast } from "react-toastify";

interface ProfileProps {
  handleLogout: () => void;
}

const Profile = ({ handleLogout }: ProfileProps) => {
  const currentUser = getUser();

  const [inputValue, setInputValue] = useState({
    username: currentUser.username || "",
    bio: currentUser.bio || "",
  });
  const [edit, setEdit] = useState({ username: false, bio: false });

  const updateUser = useMutation({
    mutationFn: async (data: {
      user_id: string;
      username?: string;
      bio?: string;
    }) => {
      const res = (await newRequest.put("/user/update", data)).data;
      return res;
    },
    onSuccess: (_, variables) => {
      const updatedUser = {
        ...currentUser,
        ...(variables.bio && { bio: variables.bio }),
        ...(variables.username && { username: variables.username }),
      };
      setUser(updatedUser);
      if (variables.username) {
        toast.success("Username updated successfully.");
        setEdit((prev) => ({ ...prev, username: false }));
      }
      if (variables.bio) {
        toast.success("Bio updated successfully.");
        setEdit((prev) => ({ ...prev, bio: false }));
      }
    },
    onError: () => {
      toast.error("Failed to update user information. Please try again.");
    },
  });
  const handleEditUsername = () => {
    updateUser.mutate({
      user_id: currentUser.id,
      username: inputValue.username,
    });
  };

  const handleEditBio = () => {
    updateUser.mutate({ user_id: currentUser.id, bio: inputValue.bio });
  };

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center w-full text-center space-y-4 py-4">
        <img
          src={currentUser.profile_url} // Placeholder for user photo
          alt="User Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="">
          <p className="text-gray-600">{currentUser.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <label className="block text-lg font-medium text-gray-800">
              Username
            </label>
            {!edit.username && (
              <button
                className="text-gray-600 hover:text-gray-700"
                onClick={() => setEdit((prev) => ({ ...prev, username: true }))}
              >
                <FiEdit3 className="text-xl" />
              </button>
            )}
          </div>
          {edit.username ? (
            <div className="w-full relative">
              <input
                autoFocus
                className="bg-gray-100 rounded-lg p-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-secondary-purple/50 focus:border-transparent"
                type="text"
                value={inputValue.username}
                placeholder="Username"
                onChange={(e) => {
                  setInputValue((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }));
                }}
              />
              <div className="absolute -top-6 right-4 flex items-center justify-center space-x-2.5 text-primary-purple">
                {updateUser.isPending && updateUser.variables.username ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : (
                  <button
                    onClick={handleEditUsername}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <FaCheck />
                  </button>
                )}
                <button
                  className="text-gray-600 hover:text-gray-700"
                  onClick={() =>
                    setEdit((prev) => ({ ...prev, username: false }))
                  }
                >
                  <FaX />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800">{currentUser.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <label className="block text-lg font-medium text-gray-800">
              Bio
            </label>
            {!edit.bio && (
              <button
                className="text-gray-600 hover:text-gray-700"
                onClick={() => setEdit((prev) => ({ ...prev, bio: true }))}
              >
                <FiEdit3 className="text-xl" />
              </button>
            )}
          </div>
          {edit.bio ? (
            <div className="w-full relative">
              <textarea
                autoFocus
                className="bg-gray-100 rounded-lg p-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-secondary-purple/50 focus:border-transparent"
                value={inputValue.bio}
                placeholder="Bio"
                onChange={(e) => {
                  setInputValue((prev) => ({ ...prev, bio: e.target.value }));
                }}
              />

              <div className="absolute -top-6 right-4 flex items-center justify-center space-x-2.5 text-primary-purple">
                {updateUser.isPending && updateUser.variables.bio ? (
                  <FaSpinner className="animate-spin h-5 w-5" />
                ) : (
                  <button
                    onClick={handleEditBio}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    <FaCheck />
                  </button>
                )}
                <button
                  className="text-gray-600 hover:text-gray-700"
                  onClick={() => setEdit((prev) => ({ ...prev, bio: false }))}
                >
                  <FaX />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800">
              {currentUser.bio ? currentUser.bio : "No bio"}
            </p>
          )}
        </div>
      </div>

      <button
        className="font-medium text-gray-700 bg-gray-200 p-2 w-full space-x-2 hover:bg-gray-300 rounded-lg transition flex items-center justify-center mt-4"
        onClick={handleLogout}
      >
        <IoLogOutOutline className="text-2xl" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Profile;
