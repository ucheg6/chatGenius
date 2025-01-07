import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import CreateChannelDialog from '../channels/CreateChannelDialog';
import UserSearchDialog from './UserSearchDialog';

const WelcomeScreen = () => {
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const [userSearchOpen, setUserSearchOpen] = useState(false);

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }}>
      <Typography variant="h4" gutterBottom>
        Welcome to ChatGenius
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Start a conversation or create a new channel
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setChannelDialogOpen(true)}
        >
          Create Channel
        </Button>
        <Button
          variant="outlined"
          startIcon={<PersonIcon />}
          onClick={() => setUserSearchOpen(true)}
        >
          Start a Conversation
        </Button>
      </Box>

      <CreateChannelDialog 
        open={channelDialogOpen}
        onClose={() => setChannelDialogOpen(false)}
      />
      <UserSearchDialog 
        open={userSearchOpen}
        onClose={() => setUserSearchOpen(false)}
      />
    </Box>
  );
};

export default WelcomeScreen; 
