import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleError = (error) => {
        if (error.response) {
            return error.response.data.message || 'An error occurred!';
        }
        return 'Server error! Please try again later.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4001/api/login', { username, password });
            setMessage('Login successful!');
    
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
            localStorage.setItem('userId', response.data.userId); 
            localStorage.setItem('avatar', response.data.avatar || 'http://localhost:4001/uploads/default-avatar.jpg');
            window.location.href = '/'; 
        } catch (error) {
            setMessage(handleError(error));
        }
    };
    
    return (
        <div>
            <h2>Login</h2>
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
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;
