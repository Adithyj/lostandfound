import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllFoundItems.css';

const AllFoundItems = () => {
    const [foundItems, setFoundItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFoundItems = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('http://localhost:5000/api/items/found'); // API endpoint to get all found items
                console.log(response);  // For debugging the response format
                setFoundItems(response.data.items || []);
            } catch (error) {
                console.error('Error fetching found items:', error);
                setError('There was an error fetching the found items.');
            } finally {
                setLoading(false);
            }
        };

        fetchFoundItems();
    }, []);

    return (
        <div>
            <h2>All Found Items</h2>

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
                            <p><strong>Contact Details:</strong> {item.CONTACT_DETAILS}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No found items available.</p>
            )}
        </div>
    );
};

export default AllFoundItems;
