// src/socket.ts
import io  from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_SERVER || "none";

const socket = io(SOCKET_URL);

export default socket;
