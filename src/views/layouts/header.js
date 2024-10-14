import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
    };

    return (
        <nav>
            <h1>To-Do List App</h1>
            <div>
                {username ? (
                    <>
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
