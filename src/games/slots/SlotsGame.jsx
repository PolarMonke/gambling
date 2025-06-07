import React, { useState, useEffect } from 'react';
import './SlotsGame.css';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '7', '💰', '🎰'];
const WIN_COMBINATIONS = [
  ['🍒', '🍒', '🍒'],
  ['7', '7', '7'],
  ['💰', '💰', '💰'],
  ['🎰', '🎰', '🎰']
];

export const SlotsGame = () => {
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [credits, setCredits] = useState(100);
  const [bet, setBet] = useState(5);
  const [message, setMessage] = useState('Place your bet and spin!');
  const [winAmount, setWinAmount] = useState(0);

  const spin = () => {
    if (spinning || credits < bet) return;
    
    setSpinning(true);
    setCredits(prev => prev - bet);
    setMessage('Spinning...');
    setWinAmount(0);

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

  const checkWin = () => {
    const isWin = WIN_COMBINATIONS.some(combo => 
      combo.every((symbol, i) => symbol === reels[i])
    );

    if (isWin) {
      const winMultiplier = reels[0] === '7' ? 10 : 5;
      const win = bet * winMultiplier;
      setWinAmount(win);
      setCredits(prev => prev + win);
      setMessage(`You won ${win} credits!`);
    } else {
      setMessage('Try again!');
    }
  };

  const changeBet = (amount) => {
    const newBet = bet + amount;
    if (newBet >= 1 && newBet <= 20 && newBet <= credits) {
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
          <div className="credits">Credits: {credits}</div>
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
          disabled={spinning || credits < bet}
          className="spin-button"
        >
          {spinning ? '🌀' : 'SPIN'}
        </button>
        
        <button 
          onClick={() => changeBet(1)} 
          disabled={bet >= 20 || bet >= credits || spinning}
        >
          +
        </button>
      </div>
    </div>
  );
};