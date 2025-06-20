import { useEffect, useState, useRef } from "react";
import "./GoldenShowerGame.css";
import { api } from '../../api/mockApi';

export const GoldenShowerGame = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [coins, setCoins] = useState([]);
    const [balance, setBalance] = useState(0);
    const playerXRef = useRef(50);
    const gameLoopRef = useRef(null);
    const PLAYER_WIDTH = 10;
    
    useEffect(() => {
        fetchBalance();
    }, []);
    
    const fetchBalance = async () => {
        try {
            const data = await api.getProfile();
            setBalance(data.balance);
            setPlayers(prev => prev.map(p => 
            p.id === 0 ? {...p, balance: data.balance} : p
            ));
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

    const movePlayer = (direction) => {
        if (direction === "left" && playerXRef.current > 0) {
            playerXRef.current -= 5;
        } else if (direction === "right" && playerXRef.current < 90) {
            playerXRef.current += 5;
        }
    };

    useEffect(() => {
    if (!gameStarted) return;

    const timerInterval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setGameStarted(false);
                    clearInterval(timerInterval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [gameStarted]);

    useEffect(() => {
        if (!gameStarted) return;

        const interval = setInterval(() => {
            setCoins((prevCoins) => [
                ...prevCoins,
                {
                    id: Date.now(),
                    x: Math.random() * 90,
                    y: 0,
                    value: Math.floor(Math.random() * 10) + 1,
                },
            ]);
        }, 500);

        return () => clearInterval(interval);
    }, [gameStarted]);

    useEffect(() => {
        if (!gameStarted) return;

        const updateGame = () => {
            setCoins((prevCoins) => {
                const remainingCoins = [];
                const fallenCoins = [];

                for (const coin of prevCoins) {
                const newY = coin.y + 1.5;
                if (newY > 90) {
                    fallenCoins.push({ ...coin, y: newY });
                } else {
                    remainingCoins.push({ ...coin, y: newY });
                }
                }

                fallenCoins.forEach((coin) => {
                
                if (
                    coin.x >= playerXRef.current &&
                    coin.x <= playerXRef.current + PLAYER_WIDTH
                ) {
                    updateBalance(coin.value);
                    recordAction('coin_caught');
                } else {
                    updateBalance(-coin.value);
                }
                });

            return remainingCoins;
        });

            gameLoopRef.current = requestAnimationFrame(updateGame);
            };


        gameLoopRef.current = requestAnimationFrame(updateGame);
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [gameStarted]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameStarted) return;
            if (e.key === 'ArrowLeft') movePlayer('left');
            if (e.key === 'ArrowRight') movePlayer('right');
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameStarted]);

    return (
        <div className="container">
            {!gameStarted ? (
                <div className="start-menu">
                    <button onClick={() => {
                        setTimeLeft(30);
                        setGameStarted(true);
                    }}>Start Game</button>
                </div>
            ) : (
                <div className="game-area">
                    <h2 className="balance">Balance: ${balance}</h2>
                    <h2 className="timer">Time Left: {timeLeft}s</h2>

                    {/* Player */}
                    <div className="player" style={{ left: `${playerXRef.current}%` }}></div>

                    {/* Coins */}
                    {coins.map((coin) => (
                        <div
                            key={coin.id}
                            className="coin"
                            style={{ top: `${coin.y}%`, left: `${coin.x}%` }}
                        >
                            {coin.value}
                        </div>
                    ))}
                </div>
            )}
            {gameStarted ? (
                <div className="controls">
                    <button onClick={() => movePlayer("left")}>⬅️</button>
                    <button onClick={() => movePlayer("right")}>➡️</button>
                </div>
            ) : (<div></div>)}

        </div>
    );
};
