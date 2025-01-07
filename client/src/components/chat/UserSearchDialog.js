import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  Box
} from '@mui/material';
import { searchUsers } from '../../services/userService';

const UserSearchDialog = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      setLoading(true);
      try {
        console.log('Searching for:', value);
        const results = await searchUsers(value);
        console.log('Search results:', results);
        setUsers(results);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setUsers([]);
    }
  };

  const handleUserSelect = (userId) => {
    navigate(`/chat/dm/${userId}`);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Start a Conversation</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search users..."
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
        />
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {users.map((user) => (
              <ListItem 
                button 
                key={user._id}
                onClick={() => handleUserSelect(user._id)}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar}>
                    {user.username[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={user.username}
                  secondary={user.status || 'offline'}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserSearchDialog; 
