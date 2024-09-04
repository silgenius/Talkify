interface InputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ placeholder, value, name, onChange }: InputProps) => {
  return (
    <input
      className="bg-gray-100 rounded-lg pl-8 p-2 focus:outline-none focus:ring-2 focus:ring-secondary-purple focus:border-transparent"
      type="text"
      value={value}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default Input;
