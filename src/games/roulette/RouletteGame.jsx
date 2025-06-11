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
  const [hasRotated, setHasRotated] = useState(false);
  const [currentBet, setCurrentBet] = useState(0);
  const [winner, setWinner] = useState(null);
  const [eliminatedPlayer, setEliminatedPlayer] = useState(null);
  const [isPlayerEliminated, setIsPlayerEliminated] = useState(false);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);
  const [zones, setZones] = useState(null);  
  
  const bottleRef = useRef(null);
  const spinInterval = useRef(null);
  const speedRef = useRef(0);

  const calculateZones = (latestPlayers) => {
    const activePlayers = latestPlayers.filter(p => !p.eliminated);
    const zoneSize = 360 / activePlayers.length;
    
    return activePlayers.map((player, index) => ({
      playerId: player.id,
      startAngle: index * zoneSize,
      endAngle: (index + 1) * zoneSize,
      centerAngle: index * zoneSize + zoneSize / 2,
      eleminated: player.eliminated
    }));
  };

  useEffect(() => {
    setZones(calculateZones(players));
  }, [players]);

  useEffect(() => {
    console.log("Updated zones:", zones);
  }, [zones]);

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
    spinBottle();
  };

  const spinBottle = () => {
    if (gamePhase === 'spinning') return;
    setGamePhase('spinning');
    setEliminatedPlayer(null);
    setHasRotated(false);

    const newZones = calculateZones(players);
    setZones(newZones);
    if (newZones.length === 0) return;

    speedRef.current = 0;
    const activePlayersCount = players.filter(p => !p.eliminated).length;
    speedRef.current = Math.max(10, 30 + Math.random() * 20 - activePlayersCount * 2);

    spinInterval.current = setInterval(() => {
        setRotation(prev => {
            speedRef.current *= 0.98;

            if (speedRef.current < 0.5) {
                clearInterval(spinInterval.current);

                const normalizedRotation = prev % 360;
                const winningZone = newZones.find(zone =>
                    (normalizedRotation >= zone.startAngle && normalizedRotation < zone.endAngle) ||
                    (zone.startAngle > zone.endAngle && (normalizedRotation >= zone.startAngle || normalizedRotation < zone.endAngle))
                );

                if (winningZone && !hasRotated) {
                    setHasRotated(true);
                    const losingPlayerId = players.findIndex(p => p.id === winningZone.playerId && !p.eliminated);
                    if (losingPlayerId >= 0 && !isPlayerEliminated) {
                        eliminatePlayer(losingPlayerId);
                    }
                }
                return prev;
            }
            return prev + speedRef.current;
        });
    }, 16);
  };

  const playEliminationSound = () => {
    const randomNumber = Math.floor(Math.random() * 6) + 1;
    const audio = new Audio(`/src/assets/games/BackshotRoulette/aah${randomNumber}.mp3`);
    audio.play();
  };

  const eliminatePlayer = (id) => {
    if (isPlayerEliminated) return;
    setIsPlayerEliminated(true);
    setGamePhase('results');
    playEliminationSound();

    setTimeout(() => {
      const updatedPlayers = [...players];
      const eliminated = updatedPlayers[id];
      if (!eliminated) return;

      updatedPlayers[id].eliminated = true;
      setEliminatedPlayer(eliminated);
      setEliminatedPlayer([...eliminatedPlayers, eliminated]);

      const activePlayers = updatedPlayers.filter(p => !p.eliminated);
      let share = 0;
      share = Math.floor(eliminated.bet / activePlayers.length);

      activePlayers.forEach(p => {
        p.balance += share;
      });

      setPlayers(updatedPlayers);

      if (activePlayers.length === 1) {
        setWinner(activePlayers[0]);
        setGamePhase('gameOver');
      } else if (eliminated.name === 'You' || eliminated.id === 0) {
        setGamePhase('gameOver');
      } else {
        setTimeout(() => {
            setIsPlayerEliminated(false);
            spinBottle();
        }, 1000);
      }
    }, 2000);
    };


  const resetGame = () => {
      clearInterval(spinInterval.current); // Stop any ongoing spin
      speedRef.current = 0; // Reset speed reference

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
      setEliminatedPlayers([]);
      setIsPlayerEliminated(false);
      setZones(calculateZones(players));
  };

  return (
    <div className="game-container">
      {/* Game board */}
      <div className="game-board">
        {/* Players */}
        <div className="players-container">
          {players.map((player, index) => {
            const angle = (360 / players.length) * index;
            const radian = (angle * Math.PI) / 180;
            const radius = 250; 
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
                  <img src={'/src/assets/games/BackshotRoulette/guy'+(player.id+1)+'.jpg'} className='player-image' />
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
          <img src="/src/assets/games/BackshotRoulette/bottle.webp" 
            alt="bottle" 
            className="bottle" 
            ref={bottleRef} 
            style={{ transform: `rotate(${rotation}deg)` }}/>
        </div>
        
        {/* Zone indicators (for debugging) */}
        {/* {zones.map((zone, index) => (
          <div 
            key={index}
            className="zone-indicator"
            style={{
              transform: `rotate(${zone.centerAngle}deg)`,
              opacity: 0.3
            }}
          ></div>
        ))} */}
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
            <h2>Player has been eliminated!</h2>
            <p>Their bet has been split among remaining players.</p>
            {/* <button onClick={spinBottle}>Spin Again</button> */}
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

      {/* decorations */}
      <img src="/src/assets/games/BackshotRoulette/gag.webp" className="decoration gag" />
      <img src="/src/assets/games/BackshotRoulette/handcuffs.webp" className="decoration handcuffs" />
      <img src="/src/assets/games/BackshotRoulette/male.png" className="decoration male" />
      <img src="/src/assets/games/BackshotRoulette/buttplug.png" className="decoration buttplug" />
    </div>
  );
}
