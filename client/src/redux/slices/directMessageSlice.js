import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchDirectMessages = createAsyncThunk(
  'directMessages/fetchMessages',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/dm/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const sendDirectMessage = createAsyncThunk(
  'directMessages/sendMessage',
  async ({ recipientId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/dm/${recipientId}`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchRecentConversations = createAsyncThunk(
  'directMessages/fetchRecentConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/dm/conversations/recent');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const directMessageSlice = createSlice({
  name: 'directMessages',
  initialState: {
    messages: [],
    conversations: [],
    loading: false,
    error: null,
    unreadCounts: {}
  },
  reducers: {
    addDirectMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateUnreadCount: (state, action) => {
      const { userId, count } = action.payload;
      state.unreadCounts[userId] = (state.unreadCounts[userId] || 0) + count;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDirectMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDirectMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchDirectMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendDirectMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(fetchRecentConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
      });
  },
});

export const { addDirectMessage, updateUnreadCount } = directMessageSlice.actions;
export default directMessageSlice.reducer; 
