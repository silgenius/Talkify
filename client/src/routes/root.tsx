import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import socket from "../utils/socket";
import { SocketEvent } from "../utils/socketEvents";
import { MessageType } from "../types";

export default function Root() {
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
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
