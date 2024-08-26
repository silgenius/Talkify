interface InputProps {
  className?: string;
  placeholder?: string;
}

const Input = ({ placeholder } : InputProps) => {
  return (
    <input
    type="text"
    placeholder={placeholder}
    className="bg-gray-100 rounded-lg pl-8 p-2 focus:outline-none focus:ring-2 focus:ring-secondary-purple focus:border-transparent"
  />
  )
}

export default Input