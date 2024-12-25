const db = require('../config/db');


exports.getNotifications = (req, res) => {
    const { userId } = req.params; 

    
    const query = `
        SELECT n.NOTIF_ID, n.ITEM_ID, n.LOST_USER_ID, n.FOUND_USER_ID, n.MESSAGE, n.TIME, i.NAME AS ITEM_NAME
        FROM NOTIFICATION n
        JOIN ITEM i ON n.ITEM_ID = i.ITEM_ID
        WHERE n.LOST_USER_ID = ? OR n.FOUND_USER_ID = ?
        ORDER BY n.TIME DESC;
    `;

    db.query(query, [userId, userId], (err, results) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ message: 'Failed to fetch notifications' });
        }

        
        if (results.length === 0) {
            return res.status(200).json({ message: 'No notifications found', notifications: [] });
        }

        
        return res.status(200).json({
            message: 'Notifications fetched successfully',
            notifications: results,
        });
    });
};
