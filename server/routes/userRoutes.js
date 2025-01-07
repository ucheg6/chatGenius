const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/search', auth, userController.searchUsers);
router.get('/:userId', auth, userController.getUserDetails);

module.exports = router; 
