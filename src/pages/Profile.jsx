import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
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
                const response = await fetch('http://localhost:5062/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                
                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('authToken');
                        navigate('/signin');
                    }
                    throw new Error('Failed to fetch user data');
                }
                
                const data = await response.json();
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
            const response = await fetch('http://localhost:5062/api/user/creditcard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(userData.creditCard)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save credit card');
            }
            
            setMessage('Credit card saved successfully');
        } catch (error) {
            console.error('Error:', error);
            setMessage(error.message);
        }
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        if (!userData.creditCard.cardNumber) {
            setMessage('Please add a credit card first');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5062/api/user/deposit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ amount: depositAmount })
            });
            
            if (!response.ok) {
                throw new Error('Deposit failed');
            }
            
            const data = await response.json();
            setUserData(prev => ({ ...prev, balance: data.newBalance }));
            setMessage(`Successfully deposited ${depositAmount}. New balance: ${data.newBalance}`);
            setDepositAmount(0);
        } catch (error) {
            console.error('Error:', error);
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

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            
            <div className="user-info">
                <h2>User Information</h2>
                <p><strong>Login:</strong> {userData.login}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Balance:</strong> {userData.balance}</p>
            </div>
            
            <div className="credit-card-form">
                <h2>Credit Card Information</h2>
                <form onSubmit={handleCreditCardSubmit}>
                    <div className="form-group">
                        <label>Card Number:</label>
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
                        <label>Cardholder Name:</label>
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
                        <label>Expiry Date:</label>
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
                        <label>CVV:</label>
                        <input
                            type="text"
                            name="cvv"
                            value={userData.creditCard.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            required
                        />
                    </div>
                    <button type="submit">Save Credit Card</button>
                </form>
            </div>
            
            <div className="deposit-form">
                <h2>Deposit Funds</h2>
                <form onSubmit={handleDeposit}>
                    <div className="form-group">
                        <label>Amount:</label>
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
                        Deposit
                    </button>
                </form>
            </div>
            
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default Profile;