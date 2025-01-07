import socketService from '../../services/socketService';

export const socketMiddleware = () => (store) => (next) => (action) => {
  const { type, payload } = action;

  // Handle socket initialization on login
  if (type === 'auth/login/fulfilled') {
    socketService.initializeSocket(payload.token);
  }

  // Handle socket disconnection on logout
  if (type === 'auth/logout/fulfilled') {
    socketService.disconnectSocket();
  }

  // Handle channel joining
  if (type === 'channels/setCurrentChannel') {
    const previousChannel = store.getState().channels.currentChannel;
    if (previousChannel) {
      socketService.leaveChannel(previousChannel._id);
    }
    if (payload) {
      socketService.joinChannel(payload._id);
    }
  }

  return next(action);
}; 
