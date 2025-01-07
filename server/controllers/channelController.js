const Channel = require('../models/Channel');
const User = require('../models/User');

const channelController = {
  // Get all channels
  getChannels: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { includePrivate } = req.query;

      let query = { 
        $or: [
          { type: 'public' },
          { members: userId }
        ]
      };

      const channels = await Channel.find(query)
        .populate('members', 'username avatar')
        .sort({ createdAt: -1 });

      res.json(channels);
    } catch (error) {
      console.error('Get channels error:', error);
      res.status(500).json({ message: 'Error fetching channels' });
    }
  },

  // Get single channel
  getChannel: async (req, res) => {
    try {
      const channel = await Channel.findById(req.params.id)
        .populate('members', 'username avatar status')
        .populate('createdBy', 'username');

      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }

      res.json(channel);
    } catch (error) {
      console.error('Get channel error:', error);
      res.status(500).json({ message: 'Error fetching channel' });
    }
  },

  // Create new channel
  createChannel: async (req, res) => {
    try {
      const { name, description, type = 'public' } = req.body;
      const createdBy = req.user.userId;

      const channel = new Channel({
        name,
        description,
        type,
        createdBy,
        members: [createdBy]
      });

      await channel.save();
      await channel.populate('members', 'username avatar');

      // Get io instance from app
      const io = req.app.get('io');
      
      // Emit channel creation event
      if (io) {
        io.emit('channel_created', channel);
      }

      res.status(201).json(channel);
    } catch (error) {
      console.error('Create channel error:', error);
      res.status(500).json({ message: 'Error creating channel' });
    }
  },

  // Join channel
  joinChannel: async (req, res) => {
    try {
      const channelId = req.params.id;
      const userId = req.user.userId;

      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }

      // Check if user is already a member
      if (channel.members.includes(userId)) {
        return res.status(400).json({ message: 'Already a member of this channel' });
      }

      // Add user to channel members
      channel.members.push(userId);
      await channel.save();

      // Notify channel members about new user
      req.io.to(channelId).emit('user_joined', {
        channelId,
        userId,
        username: req.user.username
      });

      res.json({ message: 'Successfully joined channel' });
    } catch (error) {
      console.error('Join channel error:', error);
      res.status(500).json({ message: 'Error joining channel' });
    }
  },

  // Leave channel
  leaveChannel: async (req, res) => {
    try {
      const channelId = req.params.id;
      const userId = req.user.userId;

      const channel = await Channel.findById(channelId);
      if (!channel) {
        return res.status(404).json({ message: 'Channel not found' });
      }

      // Remove user from members array
      channel.members = channel.members.filter(
        member => member.toString() !== userId
      );
      
      await channel.save();

      // Notify channel members about user leaving
      req.io.to(channelId).emit('user_left', {
        channelId,
        userId,
        username: req.user.username
      });

      res.json({ message: 'Successfully left channel' });
    } catch (error) {
      console.error('Leave channel error:', error);
      res.status(500).json({ message: 'Error leaving channel' });
    }
  }
};

module.exports = channelController; 
