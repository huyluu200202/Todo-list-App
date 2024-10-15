import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleError = (error) => {
        if (error.response) {
            return error.response.data.message || 'An error occurred!';
        }
        return 'Server error! Please try again later.';
    };

    const validateInput = () => {
        if (username.length < 3 || username.length > 15) {
            return "Username must be between 3 and 15 characters long.";
        }
        if (password.length < 6 || password.length > 30) {
            return "Password must be between 6 and 30 characters long.";
        }
        return null; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateInput();
        if (validationError) {
            setMessage(validationError);
            return;
        }

        try {
            await axios.post('http://localhost:4001/api/register', {
                username,
                password,
            });
            setMessage('Registration successful! You can now login.');
            setUsername('');
            setPassword('');
            window.location.href = '/login';
        } catch (error) {
            setMessage(handleError(error));
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <br />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
