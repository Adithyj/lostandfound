const express = require('express');
const {
    registerUser,
    loginUser,
    updateUserProfile,
    deleteUserAccount,
    getUserDetails,
} = require('../controller/userController');

const router = express.Router();

// Create
router.post('/register', registerUser);
router.post('/login', loginUser);

// Update
router.put('/:userId', updateUserProfile);

// Delete
router.delete('/:userId', deleteUserAccount);
//fetch user details 
router.get('/:userId', getUserDetails);

module.exports = router;
