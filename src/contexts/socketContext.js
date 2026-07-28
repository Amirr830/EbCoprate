// src/context/socketContext.js
import React, { createContext, useContext, useEffect } from "react";
import socket from "../app/socket.js";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    useEffect(() => {
        console.log('sssssssssss')
        socket.connect();

        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
