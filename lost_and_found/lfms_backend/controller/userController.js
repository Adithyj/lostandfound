const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user (CREATE)
exports.registerUser = async (req, res) => {
    const { firstName, lastName, phoneNumber, email, gender, password } = req.body;
     
    try {
        console.log(password);
        console.log(req.body);
        const query = `INSERT INTO USER (FIRST_NAME, LAST_NAME, PHONE_NUMBER, EMAIL, GENDER, PASSWORD) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(query, [firstName, lastName, phoneNumber, email, gender, password], (err) => {
            if (err) return res.status(500).json({ message: 'Error registering user', error: err });

            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// User login (READ)
exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM USER WHERE EMAIL = ?`;
    console.log('Query:', query, 'Parameters:', [email]); // Log query and parameters

    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        console.log('Results:', results); // Log the results to see what is returned

        if (results.length === 0) {
            // If no user is found, return early
            return res.status(404).json({ message: 'User not found' });
        }

        const user = results[0];

        // Compare password (you should be using bcrypt for hashing in production)
        if (password !== user.PASSWORD) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // If password matches, sign the JWT token
        const token = jwt.sign({ id: user.USER_ID }, "mysecretkey", { expiresIn: '1h' });

        // Send the response with the token
        console.log("Login successful");
        return res.json({ message: 'Login successful',userId: user.USER_ID, });
    });
};



// Update user profile (UPDATE)
exports.updateUserProfile = (req, res) => {
    const { userId } = req.params;
    const { firstName, lastName, phoneNumber, email, gender } = req.body;

    // Updated query to exclude the removed ROLL_NO_EMP_ID column
    const query = `UPDATE USER SET FIRST_NAME = ?, LAST_NAME = ?, PHONE_NUMBER = ?, EMAIL = ?, GENDER = ? WHERE USER_ID = ?`;
    db.query(query, [firstName, lastName, phoneNumber, email, gender, userId], (err) => {
        if (err) return res.status(500).json({ message: 'Error updating profile', error: err });

        res.json({ message: 'User profile updated successfully' });
    });
};

// Get user details (READ)
exports.getUserDetails = (req, res) => {
    const { userId } = req.params;

    const query = `SELECT FIRST_NAME, LAST_NAME, PHONE_NUMBER, EMAIL, GENDER FROM USER WHERE USER_ID = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving user details', error: err });

        if (results.length === 0) return res.status(404).json({ message: 'User not found' });

        res.json(results[0]);
    });
};

// Delete user account (DELETE)
exports.deleteUserAccount = (req, res) => {
    const { userId } = req.params;

    const query = `DELETE FROM USER WHERE USER_ID = ?`;
    db.query(query, [userId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting user account', error: err });

        res.json({ message: 'User account deleted successfully' });
    });
};
