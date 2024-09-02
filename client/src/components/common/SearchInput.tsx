import React, { ChangeEvent } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center bg-[#F1F2F6] rounded-lg shadow-d mb-4">
      <AiOutlineSearch className="text-gray-500 ml-4" size={20} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search"
        className="flex-1 p-2 bg-transparent border-none outline-none text-gray-700"
      />
    </div>
  );
};

export default SearchInput;