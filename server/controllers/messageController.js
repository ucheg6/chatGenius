const Message = require('../models/Message');

const messageController = {
  // Get messages for a channel
  getChannelMessages: async (req, res) => {
    try {
      const { channelId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const messages = await Message.find({
        channel: channelId,
        parentMessage: null // Only get main messages, not replies
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('sender', 'username avatar')
        .populate('reactions.users', 'username avatar');

      const total = await Message.countDocuments({
        channel: channelId,
        parentMessage: null
      });

      res.json({
        messages,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ message: 'Error fetching messages' });
    }
  },

  // Create a new message
  createMessage: async (req, res) => {
    try {
      const { channelId } = req.params;
      const { content } = req.body;
      const userId = req.user.userId;

      const message = new Message({
        channel: channelId,
        sender: userId,
        content
      });

      await message.save();
      await message.populate('sender', 'username avatar');

      // Get io instance from req
      const io = req.app.get('io');
      
      // Emit to channel room
      io.to(channelId).emit('new_message', message);

      res.status(201).json(message);
    } catch (error) {
      console.error('Create message error:', error);
      res.status(500).json({ message: 'Error creating message' });
    }
  },

  // Reply to a message
  createReply: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { content } = req.body;
      const sender = req.user.userId;

      const parentMessage = await Message.findById(messageId);
      if (!parentMessage) {
        return res.status(404).json({ message: 'Parent message not found' });
      }

      const reply = new Message({
        content,
        sender,
        channel: parentMessage.channel,
        parentMessage: messageId
      });

      await reply.save();
      await reply.populate('sender', 'username avatar');

      // Emit the new reply to all users in the channel
      req.io.to(parentMessage.channel.toString()).emit('new_reply', {
        parentMessageId: messageId,
        reply
      });

      res.status(201).json(reply);
    } catch (error) {
      console.error('Create reply error:', error);
      res.status(500).json({ message: 'Error creating reply' });
    }
  },

  // Add reaction to a message
  addReaction: async (req, res) => {
    try {
      const { messageId } = req.params;
      const { emoji } = req.body;
      const userId = req.user.userId;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      // Find existing reaction with the same emoji
      const existingReaction = message.reactions.find(r => r.emoji === emoji);

      if (existingReaction) {
        // Add user to existing reaction if not already reacted
        if (!existingReaction.users.includes(userId)) {
          existingReaction.users.push(userId);
        }
      } else {
        // Create new reaction
        message.reactions.push({
          emoji,
          users: [userId]
        });
      }

      await message.save();
      await message.populate('reactions.users', 'username avatar');

      // Emit reaction update to all users in the channel
      req.io.to(message.channel.toString()).emit('reaction_update', {
        messageId,
        reactions: message.reactions
      });

      res.json(message.reactions);
    } catch (error) {
      console.error('Add reaction error:', error);
      res.status(500).json({ message: 'Error adding reaction' });
    }
  }
};

module.exports = messageController; 
