import { useEffect, useState } from 'react';
import '../styles/Hero.css'
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();
    const quotes = [
    "Dream big! Bet bigger!",
    "Just one more spin bro",
    "W*rk hard? Play harder!",
    "Success is one bet away",
    "Why wait for payday when you’ve got luck?",
    "Believe in yourself",
    "You miss 100% of the bets you don't place",
    "J*bs are temporary! Jackpots are forever!",
    "Bosses hate freedom",
    "Risk is self-care",
    "Only slaves do not risk"   
    ];
    const [quote, setQuote] = useState('');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    return (
        <div className='hero-container'>
            <div className="hero">
                <div className="main-text">
                    <div>
                        {t(quote)}
                    </div>
                </div>
                <img src="src/assets/splash-image.png" className='splash-image' />
            </div>
            
            {/* decorations */}
            <img src="src/assets/primogem.webp" className="decoration primogem" />
            <img src="src/assets/diamond.png" className="decoration diamond" />
            <img src="src/assets/watermelon.webp" className="decoration watermelon" />
            <img src="src/assets/banana.png" className="decoration banana" />
        </div>
    )
}

export default Hero;