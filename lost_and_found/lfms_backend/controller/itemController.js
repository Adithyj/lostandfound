const db = require('../config/db');

// Report a lost item (CREATE)
exports.reportLostItem = (req, res) => {
    const { userId, name, brand, color, category, size, details, lostPlace } = req.body;

    const itemQuery = `INSERT INTO ITEM (NAME, BRAND, COLOR, CATEGORY, SIZE, IMAGE) VALUES (?, ?, ?, ?, ?, NULL)`;
    db.query(itemQuery, [name, brand, color, category, size], (err, itemResult) => {
        if (err) return res.status(500).json({ message: 'Error reporting lost item', error: err });

        const lostQuery = `INSERT INTO LOST_ITEM (ITEM_ID, LOST_BY_USER_ID, LOST_PLACE, DETAILS) VALUES (?, ?, ?, ?)`;
        db.query(lostQuery, [itemResult.insertId, userId, lostPlace, details], (err) => {
            if (err) return res.status(500).json({ message: 'Error reporting lost item', error: err });
            res.status(201).json({ message: 'Lost item reported successfully' });
        });
});
};

// List all lost items (READ)
exports.listLostItems = (req, res) => {
    // Get the userId from the request parameters
    const userId = req.params.userId;

    // Query to fetch lost items for a specific user
    const query = `
        SELECT LOST_ITEM.LOST_ID, ITEM.NAME, ITEM.BRAND, ITEM.COLOR, ITEM.CATEGORY, ITEM.SIZE, 
               LOST_ITEM.LOST_PLACE, LOST_ITEM.LOST_TIME, LOST_ITEM.DETAILS
        FROM LOST_ITEM
        INNER JOIN ITEM ON LOST_ITEM.ITEM_ID = ITEM.ITEM_ID
        WHERE LOST_ITEM.LOST_BY_USER_ID = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving lost items', error: err });
        }

        // Send the results as a response
        res.json({ items: results });
    });
};


// Report a found item (CREATE)
exports.reportFoundItem = (req, res) => {
    const { userId, name, brand, color, category, size, foundPlace, details, contactDetails } = req.body;
const status =found;
    const itemQuery = `INSERT INTO ITEM (NAME, BRAND, COLOR, CATEGORY, SIZE, IMAGE,STATUS) VALUES (?, ?, ?, ?, ?, NULL)`;
    db.query(itemQuery, [name, brand, color, category, size,status], (err, itemResult) => {
        if (err) return res.status(500).json({ message: 'Error reporting found item', error: err });

        const foundQuery = `INSERT INTO FOUND_ITEM (ITEM_ID, FOUND_BY_USER_ID, FOUND_PLACE, DETAILS, CONTACT_DETAILS) VALUES (?, ?, ?, ?, ?)`;
        db.query(foundQuery, [itemResult.insertId, userId, foundPlace, details, contactDetails], (err) => {
            if (err) return res.status(500).json({ message: 'Error reporting found item', error: err });
            res.status(201).json({ message: 'Found item reported successfully' });
        });
    });
};


// List all found items (READ)
exports.listFoundItemsAll = (req, res) => {
    const query = `
        SELECT 
            FOUND_ITEM.FOUND_ID, 
            FOUND_ITEM.FOUND_PLACE, 
            FOUND_ITEM.FOUND_TIME, 
            FOUND_ITEM.DETAILS,
            FOUND_ITEM.CONTACT_DETAILS, 
            ITEM.NAME, 
            ITEM.BRAND, 
            ITEM.COLOR, 
            ITEM.CATEGORY, 
            ITEM.SIZE  
        FROM FOUND_ITEM 
        INNER JOIN ITEM ON FOUND_ITEM.ITEM_ID = ITEM.ITEM_ID
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving found items', error: err });
        res.json({ items: results }); 
    });
};

exports.listFoundItems = (req, res) => {
    // Get the userId from the request parameters
    const userId = req.params.userId;

    // Query to fetch found items for a specific user
    const query = `
        SELECT 
            FOUND_ITEM.FOUND_ID, 
            FOUND_ITEM.FOUND_PLACE, 
            FOUND_ITEM.FOUND_TIME, 
            FOUND_ITEM.DETAILS, 
            ITEM.NAME, 
            ITEM.BRAND, 
            ITEM.COLOR, 
            ITEM.CATEGORY, 
            ITEM.SIZE
        FROM FOUND_ITEM 
        INNER JOIN ITEM ON FOUND_ITEM.ITEM_ID = ITEM.ITEM_ID
        WHERE FOUND_ITEM.FOUND_BY_USER_ID = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving found items', error: err });
        }

        
        res.json({ items: results });
    });
};



exports.updateItemDetails = (req, res) => {
    console.log('Request body:', req.body); 

    const {
        LOST_ID,
        NAME: name,
        BRAND: brand,
        COLOR: color,
        CATEGORY: category,
        SIZE: size,
        LOST_PLACE: lostPlace,
        LOST_TIME: lostTime,
        DETAILS: details,
    } = req.body;

    if (!LOST_ID) {
        return res.status(400).json({ message: 'LOST_ID is required to update details.' });
    }

    
    const itemUpdateFields = [];
    const itemUpdateValues = [];
    const lostItemUpdateFields = [];
    const lostItemUpdateValues = [];

   
    if (name) {
        itemUpdateFields.push('NAME = ?');
        itemUpdateValues.push(name);
    }
    if (brand) {
        itemUpdateFields.push('BRAND = ?');
        itemUpdateValues.push(brand);
    }
    if (color) {
        itemUpdateFields.push('COLOR = ?');
        itemUpdateValues.push(color);
    }
    if (category) {
        itemUpdateFields.push('CATEGORY = ?');
        itemUpdateValues.push(category);
    }
    if (size) {
        itemUpdateFields.push('SIZE = ?');
        itemUpdateValues.push(size);
    }

    
    if (lostPlace) {
        lostItemUpdateFields.push('LOST_PLACE = ?');
        lostItemUpdateValues.push(lostPlace);
    }
   
    if (details) {
        lostItemUpdateFields.push('DETAILS = ?');
        lostItemUpdateValues.push(details);
    }

    
    if (itemUpdateFields.length === 0 && lostItemUpdateFields.length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    
    const updatePromises = [];

    
    if (itemUpdateFields.length > 0) {
        const itemQuery = `UPDATE ITEM 
                           INNER JOIN LOST_ITEM ON ITEM.ITEM_ID = LOST_ITEM.ITEM_ID
                           SET ${itemUpdateFields.join(', ')} 
                           WHERE LOST_ITEM.LOST_ID = ?`;
        updatePromises.push(
            new Promise((resolve, reject) => {
                db.query(itemQuery, [...itemUpdateValues, LOST_ID], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            })
        );
    }

    
    if (lostItemUpdateFields.length > 0) {
        const lostQuery = `UPDATE LOST_ITEM SET ${lostItemUpdateFields.join(', ')} WHERE LOST_ID = ?`;
        updatePromises.push(
            new Promise((resolve, reject) => {
                db.query(lostQuery, [...lostItemUpdateValues, LOST_ID], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            })
        );
    }

    
    Promise.all(updatePromises)
        .then(() => res.json({ message: 'Item and lost item details updated successfully.' }))
        .catch((err) => res.status(500).json({ message: 'Error updating details', error: err }));
};


exports.updateFoundItemDetails = (req, res) => {
    console.log('Request body:', req.body);

    const {
        FOUND_ID,
        NAME: name,
        BRAND: brand,
        COLOR: color,
        CATEGORY: category,
        SIZE: size,
        FOUND_PLACE: foundPlace,
        FOUND_TIME: foundTime,
        DETAILS: details,
    } = req.body;

    if (!FOUND_ID) {
        return res.status(400).json({ message: 'FOUND_ID is required to update details.' });
    }

    const itemUpdateFields = [];
    const itemUpdateValues = [];
    const foundItemUpdateFields = [];
    const foundItemUpdateValues = [];

    // Prepare the item table fields for update
    if (name) {
        itemUpdateFields.push('NAME = ?');
        itemUpdateValues.push(name);
    }
    if (brand) {
        itemUpdateFields.push('BRAND = ?');
        itemUpdateValues.push(brand);
    }
    if (color) {
        itemUpdateFields.push('COLOR = ?');
        itemUpdateValues.push(color);
    }
    if (category) {
        itemUpdateFields.push('CATEGORY = ?');
        itemUpdateValues.push(category);
    }
    if (size) {
        itemUpdateFields.push('SIZE = ?');
        itemUpdateValues.push(size);
    }

    // Prepare the found_item table fields for update
    if (foundPlace) {
        foundItemUpdateFields.push('FOUND_PLACE = ?');
        foundItemUpdateValues.push(foundPlace);
    }
   
    if (details) {
        foundItemUpdateFields.push('DETAILS = ?');
        foundItemUpdateValues.push(details);
    }

    // If no valid fields are provided for update, return an error
    if (itemUpdateFields.length === 0 && foundItemUpdateFields.length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    const updatePromises = [];

    // Update ITEM table if any item-related fields are provided
    if (itemUpdateFields.length > 0) {
        const itemQuery = `
            UPDATE ITEM 
            INNER JOIN FOUND_ITEM ON ITEM.ITEM_ID = FOUND_ITEM.ITEM_ID
            SET ${itemUpdateFields.join(', ')}
            WHERE FOUND_ITEM.FOUND_ID = ?`;
        updatePromises.push(
            new Promise((resolve, reject) => {
                db.query(itemQuery, [...itemUpdateValues, FOUND_ID], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            })
        );
    }

    // Update FOUND_ITEM table if any found-item-related fields are provided
    if (foundItemUpdateFields.length > 0) {
        const foundQuery = `
            UPDATE FOUND_ITEM 
            SET ${foundItemUpdateFields.join(', ')} 
            WHERE FOUND_ID = ?`;
        updatePromises.push(
            new Promise((resolve, reject) => {
                db.query(foundQuery, [...foundItemUpdateValues, FOUND_ID], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            })
        );
    }

    // Wait for all update operations to complete
    Promise.all(updatePromises)
        .then(() => res.json({ message: 'Item and found item details updated successfully.' }))
        .catch((err) => res.status(500).json({ message: 'Error updating details', error: err }));
};


exports.deleteItem = (req, res) => {
    const { itemId } = req.params;

    const query = `DELETE FROM ITEM WHERE ITEM_ID = ?`;
    db.query(query, [itemId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting item', error: err });
        res.json({ message: 'Item deleted successfully' });
    });
};
