import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
} from '@mui/material';
import { fetchRecentConversations } from '../../redux/slices/directMessageSlice';

const DirectMessageList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversations, loading } = useSelector((state) => state.directMessages);

  useEffect(() => {
    dispatch(fetchRecentConversations());
  }, [dispatch]);

  const handleConversationClick = (userId) => {
    navigate(`/chat/dm/${userId}`);
  };

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  return (
    <List sx={{ px: 2 }}>
      {conversations.map((conv) => (
        <ListItemButton
          key={conv._id}
          onClick={() => handleConversationClick(conv._id)}
        >
          <ListItemAvatar>
            <Avatar src={conv.user.avatar}>
              {conv.user.username[0]}
            </Avatar>
          </ListItemAvatar>
          <ListItemText 
            primary={conv.user.username}
            secondary={conv.lastMessage?.content}
            secondaryTypographyProps={{
              noWrap: true,
              style: { maxWidth: '150px' }
            }}
          />
          {conv.unreadCount > 0 && (
            <Badge badgeContent={conv.unreadCount} color="primary" />
          )}
        </ListItemButton>
      ))}
    </List>
  );
};

export default DirectMessageList; 
