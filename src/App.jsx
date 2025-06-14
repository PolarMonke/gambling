import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home'
import SignIn from './pages/SignIn';
import { GamesPage } from './pages/GamesPage';
import { GamePage } from './pages/GamePage';
import { allGames } from './data/games';
import Profile from './pages/Profile';

function App() {

  return (
    <div>
      <Router>
      <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/signin' element={<SignIn/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/games" element={<GamesPage />} />
            {allGames.map(game => (
              <Route 
                key={game.id}
                path={`/games/${game.id}`}
                element={<GamePage gameId={game.id} />}
              />
            ))}
          </Routes>
        </main>
      </Router>
    </div>
  )
}

export default App
