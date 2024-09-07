import { BiSearch } from "react-icons/bi";

interface SearchInputProps {
  value: string;
  onInputChange: (value: string) => void;
  chips?: React.JSX.Element[];
  isMulti?: boolean;
  placeholder?: string;
}

const SearchInput = ({
  value,
  onInputChange,
  chips,
  isMulti = false,
  placeholder,
}: SearchInputProps) => {
  return (
    <div className="flex flex-wrap items-center mb-4 bg-gray-100 rounded-xl px-4 py-2 shadow-inner">
      {isMulti && chips}
      <div className="flex-grow">
        <div className="flex items-center">
          <BiSearch className="text-gray-500 mr-2" size={20} />
          <input
            type="text"
            placeholder={placeholder || "Search..."}
            value={value}
            onChange={(e) => onInputChange(e.target.value)}
            className="bg-transparent outline-none text-gray-800 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
