import { Link } from "react-router-dom"
import '../styles/GameCard.css'
import { useTranslation } from 'react-i18next';

export const GameCard = ({game}) => {
    const { t } = useTranslation();
    return (
        <div className="game-card">
            <img src={game.image} alt={game.name} />
            <h3>{game.name}</h3>
            <Link to={`/games/${game.id}`} >
                <button className="play-button">
                        {t('Play Now')}
                </button>
            </Link>
        </div>
    )
}