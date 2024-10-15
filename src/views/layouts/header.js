import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || 'http://localhost:4001/uploads/default-avatar.jpg');
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('avatar');
        navigate('/login', { replace: true });
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        const userId = localStorage.getItem('userId');

        if (!userId) {
            console.error('User ID is missing!');
            return;
        }

        formData.append('avatar', file);
        formData.append('userId', userId);

        fetch('http://localhost:4001/api/upload-avatar', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                if (data.avatar) {
                    localStorage.setItem('avatar', data.avatar); 
                    setAvatar(data.avatar); 
                } else {
                    console.error('Error:', data.message);
                }
            })
            .catch(error => console.error('Error uploading avatar:', error));
    };

    return (
        <nav>
            <h1>To-Do List App</h1>
            <div>
                {username ? (
                    <>
                        <img
                            src={avatar}
                            alt="Avatar"
                            style={{ width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer' }}
                            onClick={() => document.getElementById('fileInput').click()}
                        />
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                        <span style={{ marginRight: '10px' }}>Hello, {username}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
                        <Link to="/login" style={{ margin: '0 10px' }}>Login</Link>
                        <Link to="/register" style={{ margin: '0 10px' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;
