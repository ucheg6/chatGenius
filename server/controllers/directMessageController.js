const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const DirectMessage = require('../models/DirectMessage');
const User = require('../models/User');

const directMessageController = {
  // Get conversation with a user
  getConversation: async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = ObjectId.createFromHexString(req.user.userId);
      const { page = 1, limit = 50 } = req.query;

      // Get messages from both users
      const messages = await DirectMessage.find({
        $or: [
          { sender: currentUserId, recipient: userId },
          { sender: userId, recipient: currentUserId }
        ]
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('sender', 'username avatar')
        .populate('recipient', 'username avatar');

      // Mark messages as read
      await DirectMessage.updateMany(
        {
          recipient: currentUserId,
          sender: userId,
          read: false
        },
        { read: true }
      );

      const total = await DirectMessage.countDocuments({
        $or: [
          { sender: currentUserId, recipient: userId },
          { sender: userId, recipient: currentUserId }
        ]
      });

      res.json({
        messages: messages.reverse(), // Return in chronological order
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page)
      });
    } catch (error) {
      console.error('Get conversation error:', error);
      res.status(500).json({ message: 'Error fetching conversation' });
    }
  },

  // Send direct message
  sendMessage: async (req, res) => {
    try {
      const { userId } = req.params;
      const { content } = req.body;
      const senderId = req.user.userId;

      // Check if recipient exists
      const recipient = await User.findById(userId);
      if (!recipient) {
        return res.status(404).json({ message: 'Recipient not found' });
      }

      const message = new DirectMessage({
        sender: senderId,
        recipient: userId,
        content
      });

      await message.save();
      await message.populate('sender', 'username avatar');
      await message.populate('recipient', 'username avatar');

      // Get io instance from app
      const io = req.app.get('io');
      
      // Emit new message to recipient
      io.to(userId).emit('new_direct_message', {
        message,
        from: senderId
      });

      res.status(201).json(message);
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ message: 'Error sending message' });
    }
  },

  // Get unread messages count
  getUnreadCount: async (req, res) => {
    try {
      const userId = req.user.userId;

      const unreadCounts = await DirectMessage.aggregate([
        {
          $match: {
            recipient: mongoose.Types.ObjectId(userId),
            read: false
          }
        },
        {
          $group: {
            _id: '$sender',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json(unreadCounts);
    } catch (error) {
      console.error('Get unread count error:', error);
      res.status(500).json({ message: 'Error fetching unread counts' });
    }
  },

  // Get recent conversations
  getRecentConversations: async (req, res) => {
    try {
      const currentUserId = ObjectId.createFromHexString(req.user.userId);

      const conversations = await DirectMessage.aggregate([
        {
          $match: {
            $or: [
              { sender: currentUserId },
              { recipient: currentUserId }
            ]
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ['$sender', currentUserId] },
                '$recipient',
                '$sender'
              ]
            },
            lastMessage: { $first: '$$ROOT' }
          }
        },
        {
          $limit: 20
        }
      ]);

      // Populate user details
      await DirectMessage.populate(conversations, {
        path: 'lastMessage.sender lastMessage.recipient',
        select: 'username avatar status'
      });

      res.json(conversations);
    } catch (error) {
      console.error('Get recent conversations error:', error);
      res.status(500).json({ message: 'Error fetching recent conversations' });
    }
  }
};

module.exports = directMessageController; 
