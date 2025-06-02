import '../styles/Hero.css'

const Hero = () => {
    return (
        <div className='hero-container'>
            <div className="hero">
                <div className="main-text">
                    <div>
                        Become a
                        <br /> Gambler
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