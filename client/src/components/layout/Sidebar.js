import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Avatar,
  Tooltip,
} from '@mui/material';
import { fetchRecentConversations } from '../../redux/slices/directMessageSlice';
import { fetchChannels } from '../../redux/slices/channelSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversations } = useSelector(state => state.directMessages);
  const { channels } = useSelector(state => state.channels);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchRecentConversations());
  }, [dispatch]);

  const handleChannelClick = (channelId) => {
    navigate(`/chat/channel/${channelId}`);
  };

  const handleDirectMessageClick = (userId) => {
    navigate(`/chat/dm/${userId}`);
  };

  return (
    <Box sx={{ width: 240, height: '100%', bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
        Channels
      </Typography>
      <List>
        {channels.map((channel) => (
          <ListItem 
            key={channel._id}
            button
            onClick={() => handleChannelClick(channel._id)}
          >
            <ListItemIcon>#</ListItemIcon>
            <ListItemText primary={channel.name} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
        Direct Messages
      </Typography>
      <List>
        {conversations.map((conv) => {
          if (!conv || !conv._id) return null;
          
          const otherUser = conv._id;
          
          return (
            <ListItem 
              key={conv._id}
              button
              onClick={() => handleDirectMessageClick(otherUser)}
            >
              <ListItemIcon>
                <Avatar src={conv.lastMessage?.sender?.avatar}>
                  {conv.lastMessage?.sender?.username?.[0]}
                </Avatar>
              </ListItemIcon>
              <ListItemText 
                primary={conv.lastMessage?.sender?.username}
                secondary={conv.lastMessage?.content}
                secondaryTypographyProps={{
                  noWrap: true,
                  style: { maxWidth: '150px' }
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar; 
