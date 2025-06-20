import React, { useState, useEffect } from "react"
import '../styles/Header.css'
import { Link } from "react-router-dom"
import { Logo } from "./Logo"
import { api } from '../api/mockApi';

const Header = () => {
    const [balance, setBalance] = useState();

    const isLoggedIn = () => {
        return !!localStorage.getItem('authToken');
    };

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await api.getProfile();
                setBalance(data.balance);
            }
            catch (error) {
                console.error('Failed to fetch balance:', error);
                if (error.message.includes('Unauthorized') || error.message.includes('User not found')) {
                    localStorage.removeItem('authToken');
                    navigate('/signin');
                }
            }
        };
        
        fetchBalance();
        
        const intervalId = setInterval(fetchBalance, 5000);
        
        return () => clearInterval(intervalId);
    }, []);

    return (
        <header>
            <Logo />
            <div className="header-items">
                <Link to={'/games'} className="link">Games</Link>
                <Link to={'/gacha'} className="link">Gacha</Link>
                {isLoggedIn() ? (
                    <>
                        <div className="balance">Balance: {balance} $</div>
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