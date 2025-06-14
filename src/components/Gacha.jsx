import React, { useState, useEffect } from 'react';
import '../styles/Gacha.css';

const Gacha = () => {
    const [showModal, setShowModal] = useState(false);
    const [pulledCharacter, setPulledCharacter] = useState(null);
    const [userBalance, setUserBalance] = useState(0);
    const [isPulling, setIsPulling] = useState(false);
    const [error, setError] = useState('');

    // Fetch user balance on component mount
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch('http://localhost:5062/api/user/balance', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserBalance(data.balance);
                }
            } catch (err) {
                console.error('Failed to fetch balance:', err);
            }
        };
        fetchBalance();
    }, []);

    const pullCharacter = async () => {
        if (userBalance < 300) {
            setError('Not enough currency to pull!');
            return;
        }

        setIsPulling(true);
        setError('');
        
        try {
            const response = await fetch('http://localhost:5062/api/gacha/pull', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const result = await response.json();
                setPulledCharacter(result);
                setShowModal(true);
                
                // Update balance (subtract 300)
                setUserBalance(prev => prev - 300);
                
                // Play character audio
                const audio = new Audio(result.audioPath);
                audio.play().catch(e => console.error('Audio play failed:', e));
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Pull failed');
            }
        } catch (error) {
            console.error('Pull failed:', error);
            setError('Network error occurred');
        } finally {
            setIsPulling(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setPulledCharacter(null);
    };

    return (
        <div className="gacha-container-container">
            <div className="gacha-container">
                <img src="banner.png" alt="Gacha Banner" className="banner-image"/>
                
                <div className="gacha-controls">
                    <div className="balance-display">
                        Your balance: {userBalance} $
                    </div>
                    
                    <button 
                        onClick={pullCharacter} 
                        disabled={isPulling || userBalance < 300}
                        className={`pull-button ${userBalance < 300 ? 'disabled' : ''}`}
                    >
                        {isPulling ? 'Pulling...' : 'Pull (300 $)'}
                    </button>
                    
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>

            {/* Modal for showing pulled character */}
            {showModal && pulledCharacter && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={closeModal}>×</button>
                        
                        <h2>You got a new character!</h2>
                        
                        <div className={`character-card rarity-${pulledCharacter.rarity}`}>
                            <img 
                                src={pulledCharacter.imagePath} 
                                alt={pulledCharacter.name}
                                className="character-image"
                            />
                            <div className="character-info">
                                <h3>{pulledCharacter.name}</h3>
                                <div className="rarity-stars">
                                    {'★'.repeat(pulledCharacter.rarity)}
                                </div>
                            </div>
                        </div>
                        
                        <button 
                            className="confirm-button"
                            onClick={closeModal}
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gacha;