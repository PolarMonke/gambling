import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home'
import SignIn from './pages/SignIn';

function App() {

  return (
    <div>
      <Router>
      <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/signin' element={<SignIn/>} />
          </Routes>
        </main>
      </Router>
    </div>
  )
}

export default App
