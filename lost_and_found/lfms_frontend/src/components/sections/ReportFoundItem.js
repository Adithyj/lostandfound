import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReportFoundItem.css';

const ReportFoundItem = () => {
    // State for the form data
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        color: '',
        category: '',
        size: '',
        details: '',
        foundPlace: '',
        contactDetails: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Retrieve userId from localStorage
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        if (!userId) {
            setMessage('You must be logged in to report a found item.');
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
            const response = await axios.post('http://localhost:5000/api/items/found', {
                userId, // Add userId to the request payload
                ...formData, // Include the other form fields
            });
            if (response.status === 201) {
                setMessage('Found item reported successfully!');
                setFormData({
                    name: '',
                    brand: '',
                    color: '',
                    category: '',
                    size: '',
                    details: '',
                    foundPlace: '',
                    contactDetails: '',
                });
            }
        } catch (error) {
            console.error('Error reporting found item:', error);
            setMessage('Failed to report found item. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="report-found-item">
            <h2>Report Found Item</h2>
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
                    <label>Found Place:</label>
                    <input
                        type="text"
                        name="foundPlace"
                        value={formData.foundPlace}
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
                <div>
                    <label>Your Contact Details:</label>
                    <input
                        type="text"
                        name="contactDetails"
                        value={formData.contactDetails}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default ReportFoundItem;
