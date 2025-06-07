import { useState } from 'react'
import Hero from '../components/Hero';
import SignInSuggestion from '../components/SignInSuggestion';
import QuestsBox from '../components/QuestsBox';
import { FeaturedGameList } from '../components/FeaturedGamesList';

const Home = () => {
  const isLoggedIn = () => {
      return !!localStorage.getItem('authToken');
  };
  
  return (
    <div>
      <Hero />
      {isLoggedIn ? (<QuestsBox/>) : (<SignInSuggestion />)}
      <FeaturedGameList />
    </div>
  )
}

export default Home;