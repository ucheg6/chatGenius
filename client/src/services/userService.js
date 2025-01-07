import axios from '../utils/axios';

export const fetchUserDetails = async (userId) => {
  try {
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await axios.get(`/users/search?q=${query}`);
    console.log('Search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
}; 
