interface MessageProps {
  text: string;
  own?: boolean;
}
const Message = ({ text, own = false }: MessageProps) => {
  return (
    <div className={`flex gap-4 max-w-[70%] ${own && 'self-end'}`}>
      {!own && (
        <img src="/user.png" alt="" className="w-8 h-8 rounded-full" />
      )}
      <div className="flex-1 flex flex-col gap-1">
        <p
          className={`${
            own ? "bg-primary-purple text-white" : "bg-[#1f163d08] text-black"
          } p-3 rounded-xl`}
        >
          {text}
        </p>
        <span className="text-xs">1 min ago</span>
      </div>
    </div>
  );
};

export default Message;
