import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/api';
import Inventory from '../components/Inventory';

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

    const [adminPanelActive, setAdminPanelActive] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        balance: 0,
        isAdmin: false
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await api.getProfile();
                setUserData({
                    login: data.login,
                    email: data.email,
                    balance: data.balance,
                    isAdmin: data.isAdmin || false,
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
    
    const handleBuyAdmin = async () => {
        try {
            const result = await api.buyAdmin();
            setUserData(prev => ({
                ...prev,
                balance: result.newBalance,
                isAdmin: true
            }));
            setMessage('Congratulations! You are now an admin.');
        } catch (error) {
            setMessage(error.message);
        }
    };

    const toggleAdminPanel = async () => {
        if (!adminPanelActive) {
            try {
                const result = await api.getAllUsers();
                setAllUsers(result.users);
                setAdminPanelActive(true);
            } catch (error) {
                setMessage(error.message);
            }
        } else {
            setAdminPanelActive(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.adminCreateUser(newUser);
            setMessage('User created successfully');
            // Refresh users list
            const result = await api.getAllUsers();
            setAllUsers(result.users);
            // Reset form
            setNewUser({
                username: '',
                email: '',
                password: '',
                balance: 0,
                isAdmin: false
            });
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleNewUserChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="profile-container">
            <h1>{t('Profile')}</h1>
            
            <div className="user-info">
                <h2>{t('User Information')}</h2>
                <p><strong>{t('Login')}:</strong> {userData.login}</p>
                <p><strong>{t('Email')}:</strong> {userData.email}</p>
                <p><strong>{t('Balance')}:</strong> {userData.balance}</p>

                {!userData.isAdmin && (
                    <button 
                        className="buy-admin-button"
                        onClick={handleBuyAdmin}
                        disabled={userData.balance < 10000}
                    >
                        {t('Buy Admin Status (10,000)')}
                    </button>
                )}

                {userData.isAdmin && (
                    <button 
                        className="admin-panel-button"
                        onClick={toggleAdminPanel}
                    >
                        {adminPanelActive ? t('Hide Admin Panel') : t('Show Admin Panel')}
                    </button>
                )}
                
                <button 
                    className="logout-button"
                    onClick={handleLogout}
                >
                    {t('Log Out')}
                </button>
            </div>

            {adminPanelActive && (
                <div className="admin-panel">
                    <h2>{t('Admin Panel')}</h2>
                    
                    <div className="users-list">
                        <h3>{t('All Users')}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Balance</th>
                                    <th>Admin</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.balance}</td>
                                        <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="create-user-form">
                        <h3>{t('Create New User')}</h3>
                        <form onSubmit={handleCreateUser}>
                            <div className="form-group">
                                <label>{t('Username')}:</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={newUser.username}
                                    onChange={handleNewUserChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('Email')}:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUser.email}
                                    onChange={handleNewUserChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('Password')}:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleNewUserChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{t('Initial Balance')}:</label>
                                <input
                                    type="number"
                                    name="balance"
                                    value={newUser.balance}
                                    onChange={handleNewUserChange}
                                    min="0"
                                />
                            </div>
                            <div className="form-group checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isAdmin"
                                        checked={newUser.isAdmin}
                                        onChange={handleNewUserChange}
                                    />
                                    {t('Make Admin')}
                                </label>
                            </div>
                            <button type="submit">{t('Create User')}</button>
                        </form>
                    </div>
                </div>
            )}
            
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

            <div className="inventory-section">
                <h2>{t('Inventory')}</h2>
                <Inventory />
            </div>
        </div>
    );
};

export default Profile;