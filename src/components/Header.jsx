import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { api } from '../api/mockApi';
import '../styles/Header.css';
import LanguageSlotMachine from "./LanguageSlotMachine";

const Header = () => {
    const [balance, setBalance] = useState();
    const { t, i18n } = useTranslation();

    const isLoggedIn = () => {
        return !!localStorage.getItem('authToken');
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng)
            .then(() => {
                console.log(`Language changed to ${lng}`);
            })
            .catch(err => {
                console.error('Error changing language:', err);
            });
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
                <Link to={'/games'} className="link">{t('Games')}</Link>
                <Link to={'/gacha'} className="link">{t('Gacha')}</Link>
                {isLoggedIn() ? (
                    <>
                        <div className="balance">{t('Balance')}: {balance} $</div>
                        <Link to={'/profile'} className="link">{t('Profile')}</Link>
                    </>
                ) : (
                    <Link to={'/signin'} className="link">{t('Sign In')}</Link>
                )}
                <LanguageSlotMachine />
            </div>
        </header>
    );
};

export default Header;