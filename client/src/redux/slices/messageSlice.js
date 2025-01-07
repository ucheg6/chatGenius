import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchChannelMessages = createAsyncThunk(
  'messages/fetchChannelMessages',
  async ({ channelId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/channels/${channelId}/messages`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendChannelMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ channelId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/channels/${channelId}/messages`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    loading: false,
    error: null,
    hasMore: true,
    currentPage: 1
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateReaction: (state, action) => {
      const { messageId, reactions } = action.payload;
      const message = state.messages.find(m => m._id === messageId);
      if (message) {
        message.reactions = reactions;
      }
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentPage = 1;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannelMessages.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.currentPage === 1) {
          state.messages = action.payload.messages;
        } else {
          state.messages = [...action.payload.messages, ...state.messages];
        }
        state.hasMore = action.payload.currentPage < action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchChannelMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendChannelMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  }
});

export const { addMessage, updateReaction, clearMessages } = messageSlice.actions;
export default messageSlice.reducer; 
