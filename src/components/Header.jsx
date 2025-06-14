import React, { useState, useEffect } from "react"
import '../styles/Header.css'
import { Link } from "react-router-dom"
import { Logo } from "./Logo"

const Header = () => {
    const [balance, setBalance] = useState();

    const isLoggedIn = () => {
        return !!localStorage.getItem('authToken');
    };

     useEffect(() => {
        const fetchBalance = async () => {
            if (isLoggedIn()) {
                try {
                    const response = await fetch('http://localhost:5062/api/user/balance', {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setBalance(data.balance);
                    }
                } catch (error) {
                    console.error('Failed to fetch balance:', error);
                }
            }
        };
        
        fetchBalance();
    }, []);

    return (
        <header>
            <Logo />
            <div className="header-items">
                <Link to={'/games'} className="link">Games</Link>
                <Link to={'/gacha'} className="link">Gacha</Link>
                {isLoggedIn() ? (
                    <>
                        <div className="balance">Balance: {balance}</div>
                        <Link to={'/profile'} className="link">Profile</Link>
                    </>
                ) : (
                    <Link to={'/signin'} className="link">Sign In</Link>
                )}
            </div>
        </header>
    )
}

export default Header;