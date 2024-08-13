import { Outlet } from "react-router-dom";

const Conversations = () => {
  return (
  
    <div className="flex space-x-4">
      <h1>Conversations</h1>
      <Outlet />
    </div>
  )
};

export default Conversations;
