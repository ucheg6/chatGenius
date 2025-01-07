import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Badge,
} from '@mui/material';
import { Tag as TagIcon } from '@mui/icons-material';
import { fetchChannels } from '../../redux/slices/channelSlice';

const ChannelList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { channelId } = useParams();
  const { channels, loading } = useSelector((state) => state.channels);

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  const handleChannelClick = (id) => {
    navigate(`/chat/channels/${id}`);
  };

  if (loading) {
    return <div>Loading channels...</div>;
  }

  return (
    <List sx={{ px: 2 }}>
      {channels.map((channel) => (
        <ListItemButton
          key={channel._id}
          selected={channelId === channel._id}
          onClick={() => handleChannelClick(channel._id)}
        >
          <ListItemIcon>
            <TagIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={channel.name} />
          {channel.unreadCount > 0 && (
            <Badge badgeContent={channel.unreadCount} color="primary" />
          )}
        </ListItemButton>
      ))}
    </List>
  );
};

export default ChannelList; 
