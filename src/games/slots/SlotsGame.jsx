import React, { useState, useEffect } from 'react';
import './SlotsGame.css';
import { api } from '../../api/mockApi';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '7', '💰', '🎰'];
const WIN_COMBINATIONS = [
  ['🍒', '🍒', '🍒'],
  ['🍋', '🍋', '🍋'],
  ['🍊', '🍊', '🍊'],
  ['🍇', '🍇', '🍇'],
  ['🔔', '🔔', '🔔'],
  ['7', '7', '7'],
  ['💰', '💰', '💰'],
  ['🎰', '🎰', '🎰']
];

export const SlotsGame = () => {
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(5);
  const [message, setMessage] = useState('Place your bet and spin!');
  const [winAmount, setWinAmount] = useState(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const data = await api.getProfile();
      setBalance(data.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  };

  const updateBalance = async (amount) => {
    try {
      const data = await api.deposit(amount);
      setBalance(data.newBalance);
      return true;
    } catch (error) {
      console.error('Failed to update balance:', error);
      return false;
    }
  };

  const recordAction = async (actionName) => {
    try {
      await api.recordAction(actionName);
    } catch (error) {
      console.error('Failed to record action:', error);
    }
  };

  const spin = async () => {
    if (spinning || balance < bet) return;
    
    setSpinning(true);
    setMessage('Spinning...');
    setWinAmount(0);

    const deductionSuccess = await updateBalance(-bet);
    if (!deductionSuccess) {
      setSpinning(false);
      setMessage('Transaction failed');
      return;
    }

    await recordAction('slots');

    const spinDuration = 3000;
    const startTime = Date.now();
    
    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const speed = 100 * (1 - progress * 0.9);
      
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      ]);

      if (progress === 1) {
        clearInterval(spinInterval);
        checkWin();
        setSpinning(false);
      }
    }, 50);
  };

  const checkWin = async () => {
    const isWin = WIN_COMBINATIONS.some(combo => 
      combo.every((symbol, i) => symbol === reels[i])
    );

    if (isWin) {
      const winMultiplier = reels[0] === '7' ? 10 : 5;
      const win = bet * winMultiplier;
      setWinAmount(win);
      await updateBalance(win);
      setMessage(`You won ${win} credits!`);
    } else {
      setMessage('Try again!');
    }
  };

  const changeBet = (amount) => {
    const newBet = bet + amount;
    if (newBet >= 1 && newBet <= 20 && newBet <= balance) {
      setBet(newBet);
    }
  };

  return (
    <div className="slots-game">
      <div className="slots-display">
        <div className="reels-container">
          {reels.map((symbol, i) => (
            <div key={i} className={`reel ${spinning ? 'spinning' : ''}`}>
              {symbol}
            </div>
          ))}
        </div>
        
        <div className="game-info">
          <div className="credits">Balance: {balance}</div>
          <div className="bet">Bet: {bet}</div>
          <div className="win-amount">{winAmount > 0 && `+${winAmount}`}</div>
        </div>
      </div>
      
      <div className="message">{message}</div>
      
      <div className="controls">
        <button 
          onClick={() => changeBet(-1)} 
          disabled={bet <= 1 || spinning}
        >
          -
        </button>
        
        <button 
          onClick={spin} 
          disabled={spinning || balance < bet}
          className="spin-button"
        >
          {spinning ? '🌀' : 'SPIN'}
        </button>
        
        <button 
          onClick={() => changeBet(1)} 
          disabled={bet >= 20 || bet >= balance || spinning}
        >
          +
        </button>
      </div>
    </div>
  );
};