import { useState } from 'react'
import Hero from '../components/Hero';
import SignInSuggestion from '../components/SignInSuggestion';

const Home = () => {
    return (
      <div>
        <Hero />
        <SignInSuggestion />  {/* Replace with current quests when logged in */}
      </div>
    )
}

export default Home;