import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/channels', {
        params: {
          includePrivate: true
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channels');
    }
  }
);

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (channelData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/channels', channelData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create channel');
    }
  }
);

const channelSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    currentChannel: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    addChannelMessage: (state, action) => {
      const { channelId, message } = action.payload;
      const channel = state.channels.find(c => c._id === channelId);
      if (channel) {
        channel.lastMessage = message;
      }
    },
    updateChannelInfo: (state, action) => {
      const updatedChannel = action.payload;
      const index = state.channels.findIndex(c => c._id === updatedChannel._id);
      if (index !== -1) {
        state.channels[index] = { ...state.channels[index], ...updatedChannel };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.channels.push(action.payload);
      });
  }
});

export const { 
  setCurrentChannel, 
  addChannelMessage, 
  updateChannelInfo 
} = channelSlice.actions;

export default channelSlice.reducer; 
