import { useEffect, useState } from 'react'
import Hero from '../components/Hero';
import SignInSuggestion from '../components/SignInSuggestion';
import QuestsBox from '../components/QuestsBox';
import { FeaturedGamesList } from '../components/FeaturedGamesList';
import Gacha from '../components/Gacha';

const Home = () => {
  const isLoggedIn = () => {
    return !!localStorage.getItem('authToken');
  };
  
  return (
    <div>
      <Hero />
      {isLoggedIn ? (<QuestsBox/>) : (<SignInSuggestion />)}
      <FeaturedGamesList />
      <Gacha />
    </div>
  )
}

export default Home;