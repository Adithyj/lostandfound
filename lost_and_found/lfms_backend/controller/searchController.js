const db = require('../config/db');

// Search for items
exports.searchItems = (req, res) => {
    const { name, category, brand, color } = req.query;

    let query = `SELECT * FROM ITEM WHERE 1=1 `;
    const params = [];

    if (name) {
        query += `AND NAME LIKE ?`;
        params.push(`%${name}%`);
    }
    if (category) {
        query += ` AND CATEGORY = ?`;
        params.push(category);
    }
    if (brand) {
        query += ` AND BRAND = ?`;
        params.push(brand);
    }
    if (color) {
        query += ` AND COLOR = ?`;
        params.push(color.trim());
    }

    db.query(query, params, (err, results) => {
        console.log('Query:', query);
console.log('Parameters:', params);
console.log(results);

        if (err) return res.status(500).json({ message: 'Error searching items', error: err });
        res.json({ message: 'Items retrieved successfully', items: results });
    });
};
