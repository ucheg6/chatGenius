import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: {
    onlineUsers: {},
    userStatuses: {}
  },
  reducers: {
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      state.userStatuses[userId] = status;
    }
  }
});

export const { updateUserStatus } = userSlice.actions;
export default userSlice.reducer; 
