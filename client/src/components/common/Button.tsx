interface ButtonProps {
  className?: string;
  type?: "outline" | "filled";
  rounded?: boolean;
  text?: string;
  icon?: string;
  htmlType?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = ({
  className = "",
  type = "filled",
  rounded = false,
  text,
  icon,
  onClick,
  htmlType = "button",
}: ButtonProps) => {
  return (
    <button
      className={`flex items-center justify-center p-2 px-6 md:px-8 lg:px-10 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary-purple/50 active:scale-95 
        ${rounded ? "rounded-full" : "rounded-lg"} 
        ${type === "filled" 
          ? "bg-primary-purple text-white hover:bg-fuchsia-900 shadow-lg" 
          : "border border-primary-purple text-primary-purple hover:bg-primary-purple hover:text-white"} 
        ${className}`}
      onClick={onClick}
      type={htmlType}
    >
      {icon && <img src={icon} className="w-5 h-5 mr-4" alt="Button icon" />}
      <span className="text-sm md:text-base lg:text-lg font-medium">{text}</span>
    </button>
  );
};

export default Button;
