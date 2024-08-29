// src/socket.ts
import io  from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_SERVER || "http://3.84.222.216:5000/api";

const socket = io(SOCKET_URL);

export default socket;
