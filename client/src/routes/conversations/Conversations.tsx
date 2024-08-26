import { Outlet, useParams } from "react-router-dom";
import Chatlist from "../../components/list/chatList/ChatList";

const Conversations = () => {
  const { id } = useParams();
  return (

    <div className="flex space-x-4">
      <Chatlist />
      <div className="w-3/4">
        {id ?
          <Outlet />
          :
          <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl text-gray-400">Select a conversation</h1>
          </div>
        }
      </div>
    </div>
  )
};

export default Conversations;
