import { useState } from 'react'
import Hero from '../components/Hero';
import SignInSuggestion from '../components/SignInSuggestion';
import QuestsBox from '../components/QuestsBox';
import { FeaturedGamesList } from '../components/FeaturedGamesList';

const Home = () => {
  const isLoggedIn = () => {
      return !!localStorage.getItem('authToken');
  };
  
  return (
    <div>
      <Hero />
      {isLoggedIn ? (<QuestsBox/>) : (<SignInSuggestion />)}
      <FeaturedGamesList />
    </div>
  )
}

export default Home;