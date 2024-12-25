import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewLostItems.css';

const ViewLostItems = ({ userId }) => {
    const [lostItems, setLostItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editItem, setEditItem] = useState(null); // State to manage the item being edited

    useEffect(() => {
        const fetchLostItems = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:5000/api/items/lost/${userId}`);
                console.log(response);  // For debugging the response format
                setLostItems(response.data.items || []);
            } catch (error) {
                console.error('Error fetching lost items:', error);
                setError('There was an error fetching your lost items.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchLostItems();
        }
    }, [userId]);

    // Handle delete action
    const handleDelete = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/items/${itemId}`);
            setLostItems(lostItems.filter((item) => item.LOST_ID !== itemId));
        } catch (error) {
            console.error('Error deleting lost item:', error);
            setError('There was an error deleting the item.');
        }
    };

    // Handle update action
    const handleUpdate = async () => {
        try {
            const updatedItem = { ...editItem }; // Get current edited item values
            await axios.put(`http://localhost:5000/api/items/${editItem.LOST_ID}`, updatedItem);
            setLostItems(
                lostItems.map((item) =>
                    item.LOST_ID === editItem.LOST_ID ? updatedItem : item
                )
            );
            setEditItem(null); // Clear the edit form after update
        } catch (error) {
            console.error('Error updating lost item:', error);
            setError('There was an error updating the item.');
        }
    };

    return (
        <div>
            <h2>The Items which are reported as lost by you</h2>

            {loading && <p>Loading lost items...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {lostItems.length > 0 ? (
                <div className="lost-items-list">
                    {lostItems.map((item) => (
                        <div className="lost-item" key={item.LOST_ID}>
                            <h3>{item.NAME}</h3>
                            <p><strong>Brand:</strong> {item.BRAND}</p>
                            <p><strong>Category:</strong> {item.CATEGORY}</p>
                            <p><strong>Color:</strong> {item.COLOR}</p>
                            <p><strong>Size:</strong> {item.SIZE}</p>
                            <p><strong>Lost Place:</strong> {item.LOST_PLACE}</p>
                            <p><strong>Lost Time:</strong> {new Date(item.LOST_TIME).toLocaleString()}</p>
                            <p><strong>Details:</strong> {item.DETAILS}</p>

                            {/* Edit Button */}
                            <button onClick={() => setEditItem(item)}>Edit</button>

                            {/* Delete Button */}
                            <button onClick={() => handleDelete(item.LOST_ID)}>Delete</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No lost items found for this user.</p>
            )}

            {/* Edit Item Form */}
            {editItem && (
                <div className="edit-item-form">
                    <h3>Edit Lost Item</h3>
                    <input
                        type="text"
                        value={editItem.NAME}
                        onChange={(e) => setEditItem({ ...editItem, NAME: e.target.value })}
                    />
                    <input
                        type="text"
                        value={editItem.CATEGORY}
                        onChange={(e) => setEditItem({ ...editItem, CATEGORY: e.target.value })}
                    />
                    <input
                        type="text"
                        value={editItem.BRAND}
                        onChange={(e) => setEditItem({ ...editItem, BRAND: e.target.value })}
                    />
                    <input
                        type="text"
                        value={editItem.COLOR}
                        onChange={(e) => setEditItem({ ...editItem, COLOR: e.target.value })}
                    />
                    <input
                        type="text"
                        value={editItem.SIZE}
                        onChange={(e) => setEditItem({ ...editItem, SIZE: e.target.value })}
                    />
                    <textarea
                        value={editItem.DETAILS || ''}
                        onChange={(e) => setEditItem({ ...editItem, DETAILS: e.target.value })}
                    />
                    <button onClick={handleUpdate} disabled={!editItem.NAME || !editItem.CATEGORY}>
                        Save Changes
                    </button>
                </div>
            )}
        </div>
    );
};

export default ViewLostItems;
