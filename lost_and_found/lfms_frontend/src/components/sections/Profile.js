import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ userId }) => {
    const [userDetails, setUserDetails] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Fetch user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
                console.log('Response data:', response.data); // Log the raw response data
    
                // Transform keys to match frontend state structure
                const transformedData = {
                    firstName: response.data.FIRST_NAME,
                    lastName: response.data.LAST_NAME,
                    phoneNumber: response.data.PHONE_NUMBER,
                    email: response.data.EMAIL,
                    gender: response.data.GENDER,
                };
                setUserDetails(transformedData); // Update state
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
    
        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);
    

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/api/users/${userId}`, userDetails);
            console.log('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/');
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${userId}`);
            console.log('Account deleted successfully');
            localStorage.removeItem('userId');
            navigate('/login');
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className="profile-section">
            <h2>Profile</h2>
            {!isEditing ? (
                <div className="profile-details">
                    <p><strong>First Name: </strong><b>{userDetails.firstName}</b> </p>
                    <p><strong>Last Name: </strong> <b>{userDetails.lastName}</b></p>
                    <p><strong>Email: </strong> <b>{userDetails.email}</b></p>
                    <p><strong>Phone Number: </strong><b> { userDetails.phoneNumber}</b></p>
                    <p><strong>Gender: </strong> <b>{userDetails.gender}</b></p>
                    <button onClick={handleEditToggle}>Edit</button>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={handleDeleteAccount} className="delete-account">Delete Account</button>
                </div>
            ) : (
                <div className="profile-edit">
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={userDetails.firstName || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={userDetails.lastName || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={userDetails.email || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Phone Number:
                        <input
                            type="text"
                            name="phoneNumber"
                            value={userDetails.phoneNumber || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Gender:
                        <input
                            type="text"
                            name="gender"
                            value={userDetails.gender || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleEditToggle}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
