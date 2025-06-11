import { useEffect, useState, useRef } from "react";
import "./GoldenShowerGame.css";

export const GoldenShowerGame = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [coins, setCoins] = useState([]);
    const [balance, setBalance] = useState(0);
    const playerXRef = useRef(50);
    const gameLoopRef = useRef(null);
    
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
            setCoins((prevCoins) =>
                prevCoins
                    .map((coin) => ({ ...coin, y: coin.y + 1.5 }))
                    .filter((coin) => {
                        if (coin.y > 90 && Math.abs(coin.x - playerXRef.current) < 5) {
                            setBalance((prev) => prev + coin.value);
                            return false;
                        }
                        return coin.y < 100;
                    })
            );

            gameLoopRef.current = requestAnimationFrame(updateGame);
        };

        gameLoopRef.current = requestAnimationFrame(updateGame);

        return () => cancelAnimationFrame(gameLoopRef.current);
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
