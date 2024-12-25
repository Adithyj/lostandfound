import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportLostItem.css';

const ReportLostItem = () => {
    // State for the form data
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        color: '',
        category: '',
        size: '',
        details: '',
        lostPlace: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        if (!userId) {
            setMessage('You must be logged in to report a lost item.');
        }
    }, [userId]);

    // Handle form data changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        if (!userId) {
            setMessage('User ID is missing. Please log in.');
            return;
        }

        try {
            // Sending formData along with the userId to the backend
            const response = await axios.post('http://localhost:5000/api/items/lost', {
                userId, // Add userId to the request payload
                ...formData, // Include the other form fields
            });
            if (response.status === 201) {
                setMessage('Lost item reported successfully!');
                setFormData({
                    name: '',
                    brand: '',
                    color: '',
                    category: '',
                    size: '',
                    details: '',
                    lostPlace: '',
                });
            }
        } catch (error) {
            console.error('Error reporting lost item:', error);
            setMessage('Failed to report lost item. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="report-lost-item">
            <h2>Report Lost Item</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Item Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Brand:</label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Color:</label>
                    <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Size:</label>
                    <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Lost Place:</label>
                    <input
                        type="text"
                        name="lostPlace"
                        value={formData.lostPlace}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Details:</label>
                    <textarea
                        name="details"
                        value={formData.details}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default ReportLostItem;
