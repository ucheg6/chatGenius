const express = require('express');
const router = express.Router();
const directMessageController = require('../controllers/directMessageController');
const auth = require('../middleware/auth');

// Get conversation with a user
router.get('/dm/:userId', auth, directMessageController.getConversation);

// Send direct message
router.post('/dm/:userId', auth, directMessageController.sendMessage);

// Get unread messages count
router.get('/dm/unread/count', auth, directMessageController.getUnreadCount);

// Get recent conversations
router.get('/dm/conversations/recent', auth, directMessageController.getRecentConversations);

module.exports = router; 
