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
        return 'Network error! Please try again later.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
