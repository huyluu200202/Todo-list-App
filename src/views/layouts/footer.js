import React from 'react';

export default function Footer() {
    return (
        <footer className={`footer`}>
            <div className='footer-list'>
                <a href='#!'>
                    <i className="fab fa-facebook-f"></i>
                </a>
                <a href='#!'>
                    <i className="fab fa-twitter"></i>
                </a>
                <a href='#!'>
                    <i className="fab fa-google"></i>
                </a>
                <a href='#!'>
                    <i className="fab fa-instagram"></i>
                </a>
                <a href='#!'>
                    <i className="fab fa-linkedin-in"></i>
                </a>
                <a href='#!'>
                    <i className="fab fa-github"></i>
                </a>
            </div>

            <div> 
                © 2024 Copyright TodoList
            </div>
        </footer>
    );
}
