const express = require('express');
const router = express.Router();
const searchController = require('../controller/searchController');

// Search for items
router.get('/search', searchController.searchItems);

module.exports = router;
