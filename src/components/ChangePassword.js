import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

    const validateInput = () => {
        if (newPassword.length < 6 || newPassword.length > 30) {
            return "Password must be between 6 and 30 characters long.";
        }
        return null;
    };

    const handleChangePassword = (e) => {
        e.preventDefault();

        const validationError = validateInput();
        if (validationError) {
            setMessage(validationError);
            return;
        }

        const userId = localStorage.getItem('userId');

        if (!userId) {
            setMessage('User ID is missing!');
            return;
        }

        fetch('http://localhost:4001/api/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, oldPassword, newPassword }),
        })
            .then(response => response.json())
            .then(data => {
                setMessage(data.message);
                if (data.message === 'Password updated successfully') {
                    setOldPassword('');
                    setNewPassword('');

                    setTimeout(() => {
                        navigate('/'); 
                    }, 1000); 
                }
            })
            .catch(error => console.error('Error changing password:', error));
    };

    return (
        <div>
            <h2>Change Password</h2>
            <form onSubmit={handleChangePassword}>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder='Old Password'
                    required
                />
                <br />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='New Password'
                    required
                />
                <br />
                <button type="submit">Change Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ChangePassword;
