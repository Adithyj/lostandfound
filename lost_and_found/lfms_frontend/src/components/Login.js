import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import axios from 'axios';
import './Login.css'; // Import CSS for styling

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Handle form input changes
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // Handle login submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            email,
            password
        };

        try {
            // Replace this URL with your backend API endpoint
            const response = await axios.post('http://localhost:5000/api/users/login', loginData);

            // Store the token in localStorage or sessionStorage
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            console.log("Login successful");
            const userId =localStorage.getItem('userId', response.data.userId);
            console.log(userId);
            // Redirect to the dashboard or home page
            navigate('/LandingPage'); // Adjust this to your app's landing page
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Something went wrong, please try again later');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="text"  // Changed to "password" type for better security
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">Login</button>
                    
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    {/* Registration Link */}
                    <p className="register-link">
                        Don't have an account? <Link to="/register">Sign up here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
