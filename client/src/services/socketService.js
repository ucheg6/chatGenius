import io from 'socket.io-client';
import { store } from '../redux/store';
import { addMessage, updateReaction } from '../redux/slices/messageSlice';
import { addDirectMessage, updateUnreadCount } from '../redux/slices/directMessageSlice';
import { updateChannelInfo, addChannelMessage } from '../redux/slices/channelSlice';
import { updateUserStatus } from '../redux/slices/userSlice';

let socket;

export const initializeSocket = (token) => {
  socket = io('/', {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('new_message', (message) => {
    store.dispatch(addMessage(message));
    store.dispatch(addChannelMessage({
      channelId: message.channel,
      messageId: message._id
    }));
  });

  socket.on('new_direct_message', ({ message, from }) => {
    store.dispatch(addDirectMessage(message));
    store.dispatch(updateUnreadCount({
      userId: from,
      count: 1
    }));
  });

  socket.on('reaction_update', ({ messageId, reactions }) => {
    store.dispatch(updateReaction({ messageId, reactions }));
  });

  socket.on('channel_update', (channel) => {
    store.dispatch(updateChannelInfo(channel));
  });

  socket.on('user_status_change', ({ userId, status }) => {
    store.dispatch(updateUserStatus({ userId, status }));
  });

  return socket;
};

export const joinChannel = (channelId) => {
  if (socket) {
    socket.emit('join_channel', channelId);
  }
};

export const leaveChannel = (channelId) => {
  if (socket) {
    socket.emit('leave_channel', channelId);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

const socketService = {
  initializeSocket,
  joinChannel,
  leaveChannel,
  disconnectSocket,
  socket: () => socket
};

export default socketService; 
