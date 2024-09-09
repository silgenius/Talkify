import { CallProvider } from "../../contexts/CallContext";
import ChatBoard from "../_layout/ChatBoard";

const Conversation = () => {
  return (
    <CallProvider>
      <ChatBoard />
    </CallProvider>
  );
};

export default Conversation;
