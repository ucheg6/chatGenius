import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Divider, 
  Avatar,
  Badge 
} from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { 
  fetchDirectMessages, 
  sendDirectMessage 
} from '../../redux/slices/directMessageSlice';
import { fetchUserDetails } from '../../services/userService';

const DirectChat = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(state => state.directMessages);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchDirectMessages(userId));
      fetchUserDetails(userId).then(setRecipient);
    }
  }, [userId, dispatch]);

  const handleSendMessage = async (content) => {
    try {
      await dispatch(sendDirectMessage({ recipientId: userId, content })).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          color={recipient?.status === 'online' ? 'success' : 'default'}
        >
          <Avatar src={recipient?.avatar}>
            {recipient?.username?.[0]}
          </Avatar>
        </Badge>
        <Box>
          <Typography variant="h6">
            {recipient?.username || 'Loading...'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recipient?.status || 'offline'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSendMessage={handleSendMessage} disabled={!userId} />
    </Box>
  );
};

export default DirectChat; 
