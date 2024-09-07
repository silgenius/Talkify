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
  className,
  type = "filled",
  rounded = false,
  text,
  icon,
  onClick,
  htmlType = "button",
}: ButtonProps) => {
  return (
    <>
      <button
        className={`${className} flex items-center justify-center text-white p-2 px-20 ${
          rounded ? "rounded-full" : "rounded-lg"
        } ${type == "filled" ? "bg-primary-purple" : "border border-white"}`}
        onClick={onClick}
        type={htmlType}
      >
        {icon && <img src={icon} className="w-5 h-5 mr-2" />}
        <span>{text}</span>
      </button>
    </>
  );
};

export default Button;
