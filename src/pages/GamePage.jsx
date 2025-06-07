import React, { lazy, Suspense } from 'react';
import { allGames } from '../data/games';
import "../styles/GamePage.css";

export const GamePage = ({ gameId }) => {
  const game = allGames.find(g => g.id === gameId);
  
  if (!game) {
    return <div>Game not found</div>;
  }
  const GameComponent = lazy(() => 
    import(`../games/${game.id}/${game.component}`)
    .then(module => ({ default: module[game.component] }))
  );

  return (
    <div className="game-page">
      <div><h1>{game.name}</h1></div>
      <div className="game-container">
        <Suspense fallback={<div className="loading">Loading game...</div>}>
          <GameComponent />
        </Suspense>
      </div>
    </div>
  );
};