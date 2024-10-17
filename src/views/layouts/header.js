import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || 'http://localhost:4001/uploads/default-avatar.jpg');
    const [dropDown, setDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
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

    const toggleDropdown = () => {
        setDropdown(!dropDown);
    };

    return (
        <nav>
            <h1>To-Do List App</h1>
            <div>
                {email ? (
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
                        <span
                            style={{ marginRight: '10px', cursor: 'pointer' }}
                            onClick={toggleDropdown}
                        >
                            Hello, {email.split('@gmail.com')}
                        </span>
                        {dropDown && (
                            <div style={{
                                position: 'absolute',
                                top: '60px', 
                                right: '10px', 
                                padding: '10px',
                                zIndex: 1
                            }}>
                                <button
                                    onClick={() => navigate('/change-password')}
                                    style={{ display: 'block', margin: '5px 0' }}>
                                    Change Password
                                </button>
                                <button onClick={handleLogout} style={{ display: 'block', margin: '5px 0' }}>Logout</button>
                            </div>
                        )}
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
