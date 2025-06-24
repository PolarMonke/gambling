import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { api } from '../api/api';
import '../styles/Header.css';
import LanguageSlotMachine from "./LanguageSlotMachine";

const Header = () => {
    const [balance, setBalance] = useState();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuth = () => {
        const authStatus = !!localStorage.getItem('authToken');
        setIsAuthenticated(authStatus);
        return authStatus;
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

        checkAuth();

        const fetchBalance = async () => {
            if (checkAuth()) {
                try {   
                const data = await api.getProfile();
                setBalance(data.balance);
                }
                catch (error) {
                console.error('Error fetching balance:', error);
                if (error.message.includes('Token')) {
                    localStorage.removeItem('authToken');
                    setIsAuthenticated(false);
                    navigate('/signin');
                }
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
                {isAuthenticated ? (
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