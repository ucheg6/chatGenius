const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// Get messages for a channel
router.get('/channels/:channelId/messages', auth, messageController.getChannelMessages);

// Create a new message in a channel
router.post('/channels/:channelId/messages', auth, messageController.createMessage);

// Create a reply to a message
router.post('/messages/:messageId/reply', auth, messageController.createReply);

// Add reaction to a message
router.post('/messages/:messageId/reactions', auth, messageController.addReaction);

module.exports = router; 
