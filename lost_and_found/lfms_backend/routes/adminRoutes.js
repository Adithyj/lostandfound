const express = require('express');
const {
    registerAdmin,
    loginAdmin,
    viewAllUsers,
    viewAllItems,
    deleteItemByAdmin,
    deleteUserByAdmin,
} = require('../controller/adminController');

const router = express.Router();

// Create (Optional: If Admins are pre-registered, this can be skipped)
router.post('/register', registerAdmin);

// Login
router.post('/login', loginAdmin);

// Read
router.get('/users', viewAllUsers); // View all users
router.get('/items', viewAllItems); // View all items

// Delete
router.delete('/item/:itemId', deleteItemByAdmin); // Delete item by ID
router.delete('/user/:userId', deleteUserByAdmin); // Delete user by ID

module.exports = router;
