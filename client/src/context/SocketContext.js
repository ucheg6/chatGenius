import React, { createContext, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      const socket = socketService.initializeSocket(token);

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={socketService.socket()}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
}; 
