const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');
const auth = require('../middleware/auth');

// Get all channels
router.get('/channels', auth, channelController.getChannels);

// Get single channel
router.get('/channels/:id', auth, channelController.getChannel);

// Create new channel
router.post('/channels', auth, channelController.createChannel);

// Join channel
router.post('/channels/:id/join', auth, channelController.joinChannel);

// Leave channel
router.post('/channels/:id/leave', auth, channelController.leaveChannel);

module.exports = router; 
