import { FaSpinner } from "react-icons/fa"; // Import the spinner icon from react-icons

interface ButtonProps {
  className?: string;
  type?: "outline" | "filled";
  rounded?: boolean;
  text?: string;
  icon?: string;
  htmlType?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean; // Add loading prop
}

const Button = ({
  className = "",
  type = "filled",
  rounded = false,
  text,
  icon,
  onClick,
  htmlType = "button",
  loading = false, // Default loading to false
}: ButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center p-2 px-6 md:px-8 lg:px-10 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary-purple/50 active:scale-95 
        ${rounded ? "rounded-full" : "rounded-lg"} 
        ${type === "filled" 
          ? "bg-primary-purple text-white hover:bg-fuchsia-900 shadow-lg" 
          : "border border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white"} 
        ${className} ${loading ? "cursor-not-allowed opacity-60" : ""}`} // Disable and style when loading
      onClick={!loading ? onClick : undefined} // Prevent clicks while loading
      type={htmlType}
      disabled={loading} // Disable button while loading
    >
      {loading ? ( // Display loading spinner
        <FaSpinner className="animate-spin h-5 w-5 mr-3" /> // Use react-icons spinner
      ) : (
        icon && <img src={icon} className="w-5 h-5 mr-4" alt="Button icon" />
      )}
      <span className="text-sm md:text-base lg:text-lg font-medium">
        {text} {/* Keep the button text unchanged */}
      </span>
    </button>
  );
};

export default Button;
