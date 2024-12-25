const express = require('express');
const {
    reportLostItem,
    reportFoundItem,
    listLostItems,
    listFoundItems,
    listFoundItemsAll,
    updateItemDetails,
    updateFoundItemDetails,
    deleteItem,
} = require('../controller/itemController');

const router = express.Router();

// Create
router.post('/lost', reportLostItem);
router.post('/found', reportFoundItem);

// Read
// Add userId to the route to fetch lost items for a specific user
router.get('/lost/:userId', listLostItems);  // Modify this route to accept userId
router.get('/found/:userId', listFoundItems);
router.get('/found',listFoundItemsAll)

// Update
router.put('/:itemId', updateItemDetails);
router.put('/found/:itemId',updateFoundItemDetails)

// Delete
router.delete('/:itemId', deleteItem);

module.exports = router;
