import { useState } from "react";
import Modal from "../../../components/common/Modal";
import { useMutation } from "@tanstack/react-query";
import newRequest from "../../../utils/newRequest";
import { toast } from "react-toastify";
import { UserType } from "../../../types";
import { AxiosError } from "axios";

interface SearchModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}
const SearchModal = ({ isModalOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResults] = useState<string>();

  const getUser = useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = (await newRequest.post("/user/email", data)).data;
      console.log(res);
      return res;
    },
    onSuccess: (data: UserType) => {
      setResults(data.username);
    },
    onError: (error: AxiosError) => {
      if (error.status === 404) toast.error("User not found");
      else toast.error(error.message);
    },
  });

  const handleSearch = () => {
    if (!searchQuery) return;
    getUser.mutate({ email: searchQuery });
  };
  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Create New Conversation
      </h2>
      <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 shadow-inner">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow bg-transparent outline-none text-gray-800"
        />
        <button
          onClick={handleSearch}
          className="ml-3 px-4 py-2 bg-primary-purple text-white font-semibold rounded-lg shadow-lg transform transition-transform hover:scale-105 hover:bg-primary-purple/90"
        >
          Search
        </button>
      </div>
      {result && (
        <div className="mt-6">
          <ul className="space-y-4">
            <li className="px-4 py-2 bg-gray-100 rounded-lg shadow-md flex items-center justify-between cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg">
              <span className="text-gray-700 font-semibold">{result}</span>
            </li>
          </ul>
        </div>
      )}
    </Modal>
  );
};

export default SearchModal;
