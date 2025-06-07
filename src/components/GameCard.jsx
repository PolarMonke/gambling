import { Link } from "react-router-dom"
import '../styles/GameCard.css'
export const GameCard = ({game}) => {
    return (
        <div className="game-card">
            <img src={game.image} alt={game.name} />
            <h3>{game.name}</h3>
            <Link to={`/games/${game.id}`} >
                <button className="play-button">
                        Play Now
                </button>
            </Link>
        </div>
    )
}