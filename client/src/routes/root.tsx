import { useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import socket from "../socket";
import { SocketEvent } from "../utils/socketEvents";
import { UserMiniDataType } from "../types";
import { getUser } from "../utils/localStorage";
import SidePanel from "./_layout/SidePanel";

export default function Root() {
  const { id } = useParams();
  const currentUser = getUser();
  const { pathname } = useLocation();


  // connection event listeners
  useEffect(() => { 
    socket.connect();

    socket.on(SocketEvent.CONNECT, () => {
      console.log("Connected to the server with socket ID:", socket.id);
      socket.emit(SocketEvent.CONNECT_USER, { user_id: currentUser?.id });
    });

    socket.on(SocketEvent.USER_CONNECTED, (data: UserMiniDataType) => {
      if (data?.id === currentUser.id) return;
      console.log(data.username, "is online");
    });

    socket.on(SocketEvent.USER_DISCONNECTED, (data: UserMiniDataType) => {
      console.log(data.username, "is offline");
    });

    socket.on(SocketEvent.ERROR, (error: string) => {
      console.error("An error occurred with the socket server:", error);
    });

    socket.on(SocketEvent.DISCONNECT, () => {
      console.log("Disconnected from the server");
      socket.emit(SocketEvent.DISCONNECT_USER, { user_id: currentUser?.id });
    });

    const handleBeforeUnload = () => {
      if (currentUser?.id) {
        socket.emit(SocketEvent.DISCONNECT_USER, { user_id: currentUser.id });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    // Cleanup on component unmount
    return () => {
      socket.off(SocketEvent.CONNECT);
      socket.off(SocketEvent.USER_CONNECTED);
      socket.off(SocketEvent.USER_DISCONNECTED);
      socket.off(SocketEvent.ERROR);
      socket.off(SocketEvent.DISCONNECT);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div
        className={`flex-1 ${
          !currentUser || id ? "w-full" : "hidden"
        } lg:block`}
      >
        <Outlet />
      </div>
    </div>
  );
}
