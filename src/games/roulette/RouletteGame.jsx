import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import './RouletteGame.css';

export const RouletteGame = () => {
  const [players, setPlayers] = useState([
    { id: 0, name: 'You', isUser: true, bet: 0, eliminated: false, balance: 1000 },
    { id: 1, name: 'Bot 1', isUser: false, bet: 0, eliminated: false, balance: 1000 },
    { id: 2, name: 'Bot 2', isUser: false, bet: 0, eliminated: false, balance: 1000 },
    { id: 3, name: 'Bot 3', isUser: false, bet: 0, eliminated: false, balance: 1000 },
    { id: 4, name: 'Bot 4', isUser: false, bet: 0, eliminated: false, balance: 1000 },
    { id: 5, name: 'Bot 5', isUser: false, bet: 0, eliminated: false, balance: 1000 },
  ]);

  const [gamePhase, setGamePhase] = useState('betting');
  const [rotation, setRotation] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [winner, setWinner] = useState(null);
  const [eliminatedPlayer, setEleminatedPlayer] = useState(null);
  const bottleRef = useRef(null);
  const spinInterval = useRef(null);
  const speedRef = useRef(0);

  const calculateZones = () => {
    const activePlayers = players.filter(p => !p.eliminated);
    const zoneSize = 360 / activePlayers.length;
    
    return activePlayers.map((player, index) => ({
      playerId: player.id,
      startAngle: index * zoneSize,
      endAngle: (index + 1) * zoneSize,
      centerAngle: index * zoneSize + zoneSize / 2
    }));
  };

  const [zones, setZones] = useState(calculateZones());

  const placeBet = () => {
    if (currentBet <= 0 || currentBet > players[0].balance) return;

    const updatedPlayers = [...players];
    updatedPlayers[0].bet = currentBet;
    updatedPlayers[0].balance -= currentBet;

    for (let i = 1; i < updatedPlayers.length; i++) {
      if (updatedPlayers[i].eliminated) continue;
      
      const variation = 0.2;
      const minBet = Math.max(10, currentBet * (1 - variation));
      const maxBet = Math.min(updatedPlayers[i].balance, currentBet * (1 + variation));
      const botBet = Math.round(Math.floor(Math.random() * (maxBet - minBet + 1)) + minBet, 0);

      updatedPlayers[i].bet = botBet;
      updatedPlayers[i].balance -= botBet;
    }

    setPlayers(updatedPlayers);
    setZones(calculateZones());
    spinBottle();
  };

  const spinBottle = () => {
    setGamePhase('spinning');
    // setEleminatedPlayer(null);
    speedRef.current = 30 + Math.random() * 20;

    spinInterval.current = setInterval(() => {
      setRotation(prev => {
        speedRef.current *= 0.99;

        if (speedRef.current < 0.1) {
          clearInterval(spinInterval.current);

          const normalizedRotation = prev % 360;
          const activeZones = zones;
          const winningZone = activeZones.find(zone =>
          (normalizedRotation >= zone.startAngle && normalizedRotation < zone.endAngle) ||
          (zone.startAngle > zone.endAngle && (normalizedRotation >= zone.startAngle || normalizedRotation < zone.endAngle))
          );

          if (winningZone) {
            const losingPlayerId = players.findIndex(p => p.id === winningZone.playerId && !p.eliminated);
            if (losingPlayerId >= 0) {
              eleminatePlayer(losingPlayerId);
            }
          }
          return prev;
        }
        return prev + speedRef.current;
      });
    }, 16)
  }

  const eleminatePlayer = (id) => {
    setGamePhase('results');
    setEleminatedPlayer(id);

    setTimeout(() => {
      const updatedPlayers = [...players];
      const eleminatedPlayer = updatedPlayers[id];
      eliminatedPlayer.eliminated = true;
      
      const activePlayers = updatedPlayers.filter(p => !p.eliminated && p.id != eleminatedPlayer.id);
      const share = Math.floor(eleminatePlayer.bet / activePlayers.length);
      
      activePlayers.forEach(p => {
        p.balance += share;
      });

      setPlayers(activePlayers);

      const remainingPlayers = updatedPlayers.filter(p => !p.eliminated);
      if (remainingPlayers.length === 1) {
        setWinner(remainingPlayers[0]);
        setGamePhase('gameOver');
      } else if (eliminatedPlayer.name === 'You' || eliminatedPlayer.id === 0) {
        setGamePhase('gameOver');
      } else {
        setZones(calculateZones());
        setGamePhase('spinning');
      }
    }, 2000);
  }

  const resetGame = () => {
    setPlayers([
      { id: 0, name: 'You', isUser: true, bet: 0, eliminated: false, balance: 1000 },
      { id: 1, name: 'Bot 1', isUser: false, bet: 0, eliminated: false, balance: 1000 },
      { id: 2, name: 'Bot 2', isUser: false, bet: 0, eliminated: false, balance: 1000 },
      { id: 3, name: 'Bot 3', isUser: false, bet: 0, eliminated: false, balance: 1000 },
      { id: 4, name: 'Bot 4', isUser: false, bet: 0, eliminated: false, balance: 1000 },
      { id: 5, name: 'Bot 5', isUser: false, bet: 0, eliminated: false, balance: 1000 },
    ]);
    setGamePhase('betting');
    setRotation(0);
    setCurrentBet(0);
    setWinner(null);
    setEliminatedPlayer(null);
    setZones(calculateZones());
  };




  return (
    <div className="game-container">
      {/* Game board */}
      <div className="game-board">
        {/* Players */}
        <div className="players-container">
          {players.map((player, index) => {
            // Calculate position around the circle
            const angle = (360 / players.length) * index;
            const radian = (angle * Math.PI) / 180;
            const radius = 150; // Distance from center
            const x = Math.sin(radian) * radius;
            const y = -Math.cos(radian) * radius;
            
            return (
              <div 
                key={player.id}
                className={`player ${player.eliminated ? 'eliminated' : ''} ${eliminatedPlayer === index ? 'eliminating' : ''}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: `translate(-50%, -50%) rotate(${angle}deg)`
                }}
              >
                <div className="player-info">
                  <div className="player-name">{player.name}</div>
                  <div className="player-balance">${player.balance}</div>
                  {player.bet > 0 && <div className="player-bet">Bet: ${player.bet}</div>}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Bottle */}
        <div className="bottle-container">
          <div 
            className="bottle" 
            ref={bottleRef}
            style={{ transform: `rotate(${rotation}deg)` }}
          ></div>
        </div>
        
        {/* Zone indicators (for debugging) */}
        {zones.map((zone, index) => (
          <div 
            key={index}
            className="zone-indicator"
            style={{
              transform: `rotate(${zone.centerAngle}deg)`,
              opacity: 0.3
            }}
          ></div>
        ))}
      </div>
      
      {/* Game controls */}
      <div className="game-controls">
        {gamePhase === 'betting' && (
          <div className="betting-phase">
            <h2>Place Your Bet</h2>
            <div className="bet-input">
              <input
                type="number"
                min="10"
                max={players[0].balance}
                value={currentBet}
                onChange={(e) => setCurrentBet(parseInt(e.target.value) || 0)}
              />
              <button onClick={placeBet}>Place Bet</button>
            </div>
            <div className="balance">Your balance: ${players[0].balance}</div>
          </div>
        )}
        
        {gamePhase === 'spinning' && (
          <div className="spinning-phase">
            <h2>Spinning...</h2>
          </div>
        )}
        
        {gamePhase === 'results' && (
          <div className="results-phase">
            <h2>{players[eliminatedPlayer]?.name} has been eliminated!</h2>
            <p>Their ${players[eliminatedPlayer]?.bet} has been split among remaining players.</p>
            <button onClick={spinBottle}>Spin Again</button>
          </div>
        )}
        
        {gamePhase === 'gameOver' && (
          <div className="game-over-phase">
            <h2>Game Over!</h2>
            {winner && <h3>{winner.name} wins with ${winner.balance}!</h3>}
            {players[0].eliminated && <h3>Game over!</h3>}
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
