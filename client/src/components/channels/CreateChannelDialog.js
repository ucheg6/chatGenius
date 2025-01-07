import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Switch
} from '@mui/material';
import { createChannel } from '../../redux/slices/channelSlice';

const CreateChannelDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [channelData, setChannelData] = useState({
    name: '',
    description: '',
    type: 'public'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createChannel(channelData)).unwrap();
      onClose();
      setChannelData({ name: '', description: '', type: 'public' });
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Channel</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Channel Name"
            fullWidth
            required
            value={channelData.name}
            onChange={(e) => setChannelData({ ...channelData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={channelData.description}
            onChange={(e) => setChannelData({ ...channelData, description: e.target.value })}
          />
          <FormControl margin="dense" fullWidth>
            <FormControlLabel
              control={
                <Switch
                  checked={channelData.type === 'private'}
                  onChange={(e) => setChannelData({
                    ...channelData,
                    type: e.target.checked ? 'private' : 'public'
                  })}
                />
              }
              label="Private Channel"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Channel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateChannelDialog; 
