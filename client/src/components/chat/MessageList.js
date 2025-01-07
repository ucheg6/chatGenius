import React, { useEffect, useRef } from 'react';
import { Box, Typography, Avatar, Paper, Chip } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const MessageList = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return <Box sx={{ p: 2 }}>Loading messages...</Box>;
  }

  return (
    <Box sx={{ 
      flex: 1, 
      overflow: 'auto', 
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      {messages.map((message) => (
        <Paper
          key={message._id}
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: 'background.paper',
            '&:hover': { backgroundColor: 'action.hover' }
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar src={message.sender.avatar}>
              {message.sender.username[0]}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle2" color="primary">
                  {message.sender.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              <Typography variant="body1">{message.content}</Typography>
              {message.reactions?.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {message.reactions.map((reaction, index) => (
                    <Chip
                      key={index}
                      size="small"
                      label={`${reaction.emoji} ${reaction.users.length}`}
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList; 
