import React, { useState, useEffect } from 'react';
import './SlotsGame.css';
import { api } from '../../api/mockApi';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '🔔', '7', '💰', '🎰'];

export const SlotsGame = () => {
  const [reels, setReels] = useState(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(5);
  const [message, setMessage] = useState('Place your bet and spin!');
  const [winAmount, setWinAmount] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await api.getProfile();
        setBalance(data.balance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };
    fetchBalance();
  }, []);

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

  const recordAction = async () => {
    try {
      await api.recordAction('slots');
    } catch (error) {
      console.error('Failed to record action:', error);
    }
  };

  const spin = async () => {
    if (spinning || balance < bet) return;

    setSpinning(true);
    setMessage('Spinning...');
    setWinAmount(0);

    const deducted = await updateBalance(-bet);
    if (!deducted) {
      setSpinning(false);
      setMessage('Transaction failed');
      return;
    }

    await recordAction();

    const finalReels = [
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    const spinDuration = 3000;
    const startTime = Date.now();

    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);

      if (progress < 1) {
        setReels([
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
          SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        ]);
      } else {
        clearInterval(spinInterval);
        setReels(finalReels);
        finalizeSpin(finalReels);
        setSpinning(false);
      }
    }, 75);
  };

  const finalizeSpin = async (finalReels) => {
    const counts = finalReels.reduce((acc, symbol) => {
      acc[symbol] = (acc[symbol] || 0) + 1;
      return acc;
    }, {});

    const maxCount = Math.max(...Object.values(counts));

    if (maxCount === 2) {
      const win = bet * 2;
      setWinAmount(win);
      await updateBalance(win);
      setMessage(`Matched 2! You won ${win} credits!`);
    } else if (maxCount === 3) {
      const win = bet * 10;
      setWinAmount(win);
      await updateBalance(win);
      setMessage(`JACKPOT! You won ${win} credits!`);
    } else {
      setMessage('Try again!');
    }
  };

  const changeBet = (delta) => {
    const newBet = bet + delta;
    if (newBet >= 1 && newBet <= balance) {
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
        <button onClick={() => changeBet(-bet+1)} disabled={spinning}>Reset</button>
        <button onClick={() => changeBet(-1)} disabled={bet <= 1 || spinning}>-</button>
        <button onClick={spin} disabled={spinning || balance < bet} className="spin-button">
          {spinning ? '🌀' : 'SPIN'}
        </button>
        <button onClick={() => changeBet(1)} disabled={ bet >= balance || spinning}>+</button>
        <button onClick={() => changeBet(balance-bet)} disabled={bet >= balance || spinning}>All-In</button>
      </div>
    </div>
  );
};
