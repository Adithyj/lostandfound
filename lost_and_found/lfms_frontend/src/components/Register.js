import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Axios instance
import './Register.css';
const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        gender: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users/register', formData);
            alert('Registration successful! Please log in.');
            navigate('/'); // Redirect to login page
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="  First Name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="  Last Name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="  Phone Number"
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="  Email"
                    onChange={handleChange}
                    required
                />
                <select
                    name="gender"
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
                <input
                    type="text"
                    name="password"
                    placeholder="  Password"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
