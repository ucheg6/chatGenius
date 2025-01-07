import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Divider } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { fetchChannelMessages, sendChannelMessage, clearMessages } from '../../redux/slices/messageSlice';
import { setCurrentChannel } from '../../redux/slices/channelSlice';

const ChannelChat = () => {
  const { channelId } = useParams();
  const dispatch = useDispatch();
  const { messages, loading } = useSelector(state => state.messages);
  const { channels } = useSelector(state => state.channels);
  const currentChannel = channels.find(c => c._id === channelId);

  useEffect(() => {
    if (channelId) {
      dispatch(clearMessages());
      dispatch(fetchChannelMessages({ channelId }));
      dispatch(setCurrentChannel(currentChannel));
    }

    return () => {
      dispatch(clearMessages());
      dispatch(setCurrentChannel(null));
    };
  }, [channelId, dispatch, currentChannel]);

  const handleSendMessage = async (content) => {
    try {
      await dispatch(sendChannelMessage({ channelId, content })).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, backgroundColor: 'background.paper' }}>
        <Typography variant="h6">
          # {currentChannel?.name || 'Loading...'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentChannel?.description}
        </Typography>
      </Box>
      <Divider />
      <MessageList messages={messages} loading={loading} />
      <MessageInput onSendMessage={handleSendMessage} disabled={!channelId} />
    </Box>
  );
};

export default ChannelChat; 
