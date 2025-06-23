import React, { useState, useEffect } from 'react';
import '../styles/Gacha.css';
import { api } from '../api/mockApi';
import { useTranslation } from 'react-i18next';

const Gacha = () => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [pulledCharacter, setPulledCharacter] = useState(null);
    const [userBalance, setUserBalance] = useState(0);
    const [isPulling, setIsPulling] = useState(false);
    const [error, setError] = useState('');
    const [rollingCharacters, setRollingCharacters] = useState([]);
    const [showRollingModal, setShowRollingModal] = useState(false);

    const [audio, setAudio] = useState({
        start: null,
        loop: null
    });

    useEffect(() => {
        setAudio({
            start: new Audio("audio/rolling-start.mp3"),
            loop: new Audio("audio/rolling-loop.mp3")
        });
        
        return () => {
            Object.values(audio).forEach(sound => {
            if (sound) {
                sound.pause();
                sound.currentTime = 0;
            }
            });
        };
    }, []);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const data = await api.getProfile();
                setUserBalance(data.balance);
            } catch (err) {
                console.error('Failed to fetch balance:', err);
            }
        };
        fetchBalance();
    }, []);

    const generateRandomCharacters = (count) => {
        const rarities = [3, 4, 5];
        return Array(count).fill().map(() => ({
            id: Math.random().toString(36).substring(7),
            imagePath: 'characters/placeholder.png',
            name: '???',
            rarity: rarities[Math.floor(Math.random() * rarities.length)]
        }));
    };

    const pullCharacter = async () => {
        if (userBalance < 300) {
            setError('Not enough currency to pull!');
            return;
        }

        setError('');
        setIsPulling(true);
        setShowRollingModal(true);
        
        audio.start.play().catch(e => console.error('Start sound error:', e));
        
        setRollingCharacters(generateRandomCharacters(5));
        
        setTimeout(() => {
            audio.loop.loop = true;
            audio.loop.play().catch(e => console.error('Loop sound error:', e));
        }, 300);

        const rollInterval = setInterval(() => {
            setRollingCharacters(generateRandomCharacters(5));
        }, 100);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            clearInterval(rollInterval);
            
            audio.loop.pause();
            audio.loop.currentTime = 0;
            
            const result = await api.pullGacha();
            setPulledCharacter(result);
            setShowRollingModal(false);
            setShowModal(true);
            setUserBalance(result.newBalance);
            
            const resultAudio = new Audio(result.audioPath);
            resultAudio.play().catch(e => console.error('Result audio error:', e));
        } catch (error) {
            console.error('Pull failed:', error);
            setError(error.message || 'Pull failed');
            setShowRollingModal(false);
            audio.loop.pause();
            audio.loop.currentTime = 0;
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
                        {t('Your balance')}: {userBalance} $
                    </div>
                    
                    <button 
                        onClick={pullCharacter} 
                        disabled={isPulling || userBalance < 300}
                        className={`pull-button ${userBalance < 300 ? 'disabled' : ''}`}
                    >
                        {isPulling ? t('Pulling...') : t('Pull (300 $)')}
                    </button>
                    
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>

            {/* Rolling animation modal */}
            {showRollingModal && (
            <div className="rolling-modal-overlay">
                <div className="rolling-modal-content">
                    <div className="rolling-animation">
                        {rollingCharacters.map((char) => (
                            <div 
                                key={char.id}
                                className={`rolling-character-card rarity-${char.rarity}`}
                            >
                                <img 
                                    src={char.imagePath} 
                                    alt={char.name}
                                    className="character-image"
                                />
                                <div className="character-info">
                                    <h3>{char.name}</h3>
                                    <div className="rarity-stars">
                                        {'★'.repeat(char.rarity)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

            {/* Modal for showing pulled character */}
            {showModal && pulledCharacter && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={closeModal}>×</button>
                        
                        <h2>{t('You got a new character!')}</h2>
                        
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
                            {t('Awesome!')}
                        </button>
                        {pulledCharacter.count > 1 && (
                            <div className="character-count">
                                {t('You now have')} {pulledCharacter.count}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gacha;