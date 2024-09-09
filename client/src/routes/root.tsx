import { useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import socket from "../socket";
import { SocketEvent } from "../utils/socketEvents";
import { MessageType } from "../types";
import { getUser } from "../utils/localStorage";
import SidePanel from "./_layout/SidePanel";

export default function Root() {
  const { id } = useParams();
  const currentUser = getUser();
  const {pathname} = useLocation();

  useEffect(() => {
    // Connect to the socket server
    socket.connect();

    socket.on(SocketEvent.CONNECT, () => {
      console.log("Connected to the server with socket ID:", socket.id);
    });

    socket.on(SocketEvent.MESSAGE_SENT, (message: MessageType) => {
      console.log("New message from server:", message);
    });

    socket.on(SocketEvent.TYPING_STARTED, () => {
      console.log("Another user has started typing");
    });

    socket.on(SocketEvent.TYPING_STOPPED, () => {
      console.log("Another user has stopped typing");
    });

    socket.on(SocketEvent.USER_CONNECTED, () => {
      console.log("Another user is online");
    });

    socket.on(SocketEvent.USER_DISCONNECTED, () => {
      console.log("Another user is offline");
    });

    socket.on(SocketEvent.ERROR, (error: string) => {
      console.error("An error occurred with the socket server:", error);
    });

    socket.on(SocketEvent.DISCONNECT, () => {
      console.log("Disconnected from the server");
    });

    // Cleanup on component unmount
    return () => {
      socket.off(SocketEvent.CONNECT);
      socket.off(SocketEvent.MESSAGE_SENT);
      socket.off(SocketEvent.TYPING_STARTED);
      socket.off(SocketEvent.TYPING_STOPPED);
      socket.off(SocketEvent.USER_CONNECTED);
      socket.off(SocketEvent.USER_DISCONNECTED);
      socket.off(SocketEvent.ERROR);
      socket.off(SocketEvent.DISCONNECT);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen flex bg-white">
      {currentUser && pathname !== "/settings" && (
        <div
          className={`flex-col bg-[#882A8508] lg:flex lg:w-1/2 xl:w-1/3 ${
            id ? "hidden" : "flex w-full"
          } h-screen shadow-xl`}
        >
          <SidePanel />
        </div>
      )}
      <div className={`flex-1 ${!currentUser || id ? "w-full" : "hidden"} lg:block`}>
        <Outlet />
      </div>
    </div>
  );
}
