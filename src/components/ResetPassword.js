import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams(); 
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:4001/api/reset-password/${token}`, { newPassword });
            setMessage(response.data.message);
            
            setTimeout(() => {
                navigate('/login');
            }, 1000);

        } catch (error) {
            setMessage('Error resetting password. Please try again.');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    required
                />
                <br />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
