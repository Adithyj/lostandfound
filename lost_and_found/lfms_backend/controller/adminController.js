const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Admin (CREATE)
exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `INSERT INTO ADMIN (USERNAME, PASSWORD) VALUES (?, ?)`;
        db.query(query, [username, hashedPassword], (err) => {
            if (err) return res.status(500).json({ message: 'Error registering admin', error: err });

            res.status(201).json({ message: 'Admin registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Admin Login (READ)
exports.loginAdmin = (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM ADMIN WHERE USERNAME = ?`;
    db.query(query, [username], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (results.length === 0) return res.status(404).json({ message: 'Admin not found' });

        const admin = results[0];
        const passwordMatch = await bcrypt.compare(password, admin.PASSWORD);
        if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin.ADMIN_ID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    });
};

// View all users (READ)
exports.viewAllUsers = (req, res) => {
    const query = `SELECT * FROM USER`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving users', error: err });

        res.json(results);
    });
};

// View all items (READ)
exports.viewAllItems = (req, res) => {
    const query = `SELECT * FROM ITEM`;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving items', error: err });

        res.json(results);
    });
};

// Delete item by Admin (DELETE)
exports.deleteItemByAdmin = (req, res) => {
    const { itemId } = req.params;

    const query = `DELETE FROM ITEM WHERE ITEM_ID = ?`;
    db.query(query, [itemId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting item', error: err });

        res.json({ message: 'Item deleted successfully by admin' });
    });
};

// Delete user by Admin (DELETE)
exports.deleteUserByAdmin = (req, res) => {
    const { userId } = req.params;

    const query = `DELETE FROM USER WHERE USER_ID = ?`;
    db.query(query, [userId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting user', error: err });

        res.json({ message: 'User deleted successfully by admin' });
    });
};
