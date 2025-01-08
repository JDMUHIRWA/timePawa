import { io } from "socket.io-client";

// Initialize the socket connection
const socket = io("http://localhost:7001", {
  withCredentials: true, // Allows CORS credentials
  autoConnect: true, // Prevents auto-connect until explicitly needed
});

export default socket;
