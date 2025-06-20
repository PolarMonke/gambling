import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/mockApi';

const Profile = () => {
    const {t} = useTranslation();
    const [userData, setUserData] = useState({
        login: '',
        email: '',
        balance: 0,
        creditCard: {
            cardNumber: '',
            cardHolderName: '',
            expiryDate: '',
            cvv: ''
        }
    });
    const [depositAmount, setDepositAmount] = useState(0);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await api.getProfile();
                setUserData({
                login: data.login,
                email: data.email,
                balance: data.balance,
                creditCard: data.creditCard || {
                    cardNumber: '',
                    cardHolderName: '',
                    expiryDate: '',
                    cvv: ''
                }
                });
            } catch (error) {
                console.error('Error:', error);
                setMessage(error.message);
            }
        };
        
        fetchUserData();
    }, [navigate]);

    const handleCreditCardSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.saveCreditCard(userData.creditCard);
            setMessage('Credit card saved successfully');
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        try {
            const data = await api.deposit(depositAmount);
            setUserData(prev => ({ ...prev, balance: data.newBalance }));
            setMessage(`Successfully deposited ${depositAmount}. New balance: ${data.newBalance}`);
            api.recordAction('deposit');
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name in userData.creditCard) {
            setUserData(prev => ({
                ...prev,
                creditCard: {
                    ...prev.creditCard,
                    [name]: value
                }
            }));
        } else {
            setUserData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleLogout = async () => {
        try {
            await api.logout();
            navigate('/signin');
        } catch (error) {
            setMessage('Logout failed: ' + error.message);
        }
    };

    return (
        <div className="profile-container">
            <h1>{t('Profile')}</h1>
            
            <div className="user-info">
                <h2>{t('User Information')}</h2>
                <p><strong>{t('Login')}:</strong> {userData.login}</p>
                <p><strong>{t('Email')}:</strong> {userData.email}</p>
                <p><strong>{t('Balance')}:</strong> {userData.balance}</p>

                <button 
                    className="logout-button"
                    onClick={handleLogout}
                >
                    {t('Log Out')}
                </button>
            </div>
            
            <div className="credit-card-form">
                <h2>{t('Credit Card Information')}</h2>
                <form onSubmit={handleCreditCardSubmit}>
                    <div className="form-group">
                        <label>{t('Card Number')}:</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={userData.creditCard.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('Cardholder Name')}:</label>
                        <input
                            type="text"
                            name="cardHolderName"
                            value={userData.creditCard.cardHolderName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('Expiry Date')}:</label>
                        <input
                            type="text"
                            name="expiryDate"
                            value={userData.creditCard.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>{t('CVV')}:</label>
                        <input
                            type="text"
                            name="cvv"
                            value={userData.creditCard.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                        />
                    </div>
                    <button type="submit">{t('Save Credit Card')}</button>
                </form>
            </div>
            
            <div className="deposit-form">
                <h2>{t('Deposit Funds')}</h2>
                <form onSubmit={handleDeposit}>
                    <div className="form-group">
                        <label>{t('Amount')}:</label>
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(Number(e.target.value))}
                            min="1"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={!userData.creditCard.cardNumber}
                    >
                        {t('Deposit')}
                    </button>
                </form>
            </div>
            
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default Profile;