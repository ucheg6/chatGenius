const User = require('../models/User');

const userController = {
  searchUsers: async (req, res) => {
    try {
      const { q } = req.query;
      const currentUserId = req.user.userId;

      if (!q) {
        return res.json([]);
      }

      const users = await User.find({
        _id: { $ne: currentUserId }, // Exclude current user
        username: { $regex: q, $options: 'i' }
      })
        .select('username avatar status')
        .limit(10);

      res.json(users);
    } catch (error) {
      console.error('User search error:', error);
      res.status(500).json({ message: 'Error searching users' });
    }
  },

  getUserDetails: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId)
        .select('username avatar status');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user details error:', error);
      res.status(500).json({ message: 'Error fetching user details' });
    }
  }
};

module.exports = userController; 
