import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home'
import SignIn from './pages/SignIn';
import { GamesPage } from './pages/GamesPage';
import { GamePage } from './pages/GamePage';
import { allGames } from './data/games';
import Profile from './pages/Profile';
import Gacha from './components/Gacha';
import './api/i18n';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {

  return (
    <div>
      <AuthProvider>
      <Router>
      <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/signin' element={<SignIn/>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/gacha" element={<Gacha />} />
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
      </AuthProvider>
    </div>
  )
}

export default App
