import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewFoundItems.css';

const ViewFoundItems = ({ userId }) => {
    const [foundItems, setFoundItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editItem, setEditItem] = useState(null); // State to manage the item being edited

    useEffect(() => {
        const fetchFoundItems = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get(`http://localhost:5000/api/items/found/${userId}`);
                console.log(response);  // For debugging the response format
                setFoundItems(response.data.items || []);
            } catch (error) {
                console.error('Error fetching found items:', error);
                setError('There was an error fetching your found items.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchFoundItems();
        }
    }, [userId]);

    // Handle delete action
    const handleDelete = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/items/found/${itemId}`);
            setFoundItems(foundItems.filter((item) => item.FOUND_ID !== itemId));
        } catch (error) {
            console.error('Error deleting found item:', error);
            setError('There was an error deleting the item.');
        }
    };

    // Handle update action
    const handleUpdate = async () => {
        try {
            const updatedItem = { ...editItem }; // Get current edited item values
            await axios.put(`http://localhost:5000/api/items/found/${editItem.FOUND_ID}`, updatedItem);
            setFoundItems(
                foundItems.map((item) =>
                    item.FOUND_ID === editItem.FOUND_ID ? updatedItem : item
                )
            );
            setEditItem(null); // Clear the edit form after update
        } catch (error) {
            console.error('Error updating found item:', error);
            setError('There was an error updating the item.');
        }
    };

    return (
        <div>
            <h2>The Items which are found by you</h2>

            {loading && <p>Loading found items...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {foundItems.length > 0 ? (
                <div className="found-items-list">
                    {foundItems.map((item) => (
                        <div className="found-item" key={item.FOUND_ID}>
                            <h3>{item.NAME}</h3>
                            <p><strong>Brand:</strong> {item.BRAND}</p>
                            <p><strong>Category:</strong> {item.CATEGORY}</p>
                            <p><strong>Color:</strong> {item.COLOR}</p>
                            <p><strong>Size:</strong> {item.SIZE}</p>
                            <p><strong>Found Place:</strong> {item.FOUND_PLACE}</p>
                            <p><strong>Found Time:</strong> {new Date(item.FOUND_TIME).toLocaleString()}</p>
                            <p><strong>Details:</strong> {item.DETAILS}</p>

                            {/* Edit Button */}
                            <button onClick={() => setEditItem(item)}>Edit</button>

                            {/* Delete Button */}
                            <button onClick={() => handleDelete(item.FOUND_ID)}>Delete</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No found items available for this user.</p>
            )}

            {/* Edit Item Form */}
            {editItem && (
                <div className="edit-item-form">
                    <h3>Edit Found Item</h3>
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

export default ViewFoundItems;
