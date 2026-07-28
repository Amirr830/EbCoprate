// src/socket.js
import { io } from "socket.io-client";
import Storages from "./storages";

console.log(process.env.REACT_APP_SOCKET_ADDRESS)
const socket = io(process.env.REACT_APP_SOCKET_ADDRESS, {
    autoConnect: false,
    path: "/panel", // باید با path سرور یکی باشه
    transports: ["websocket"], // می‌تونی polling هم بذاری
    auth: {
        "x-auth-token": Storages.getAccessToken() // باید با header مورد انتظار سرور یکی باشه
    }
});

export default socket;