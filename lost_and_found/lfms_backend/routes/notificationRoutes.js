const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notificationController');

// Route to get notifications for a user
router.get('/:userId', notificationController.getNotifications);

module.exports = router;
