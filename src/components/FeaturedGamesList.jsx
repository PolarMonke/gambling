import { featuredGames } from '../data/games';
import { GameCard } from './GameCard';
import '../styles/FeaturedGamesList.css'
export const FeaturedGameList = () => {
    return (
        <div className="featured-games">
            {featuredGames.map(game => (
            <GameCard key={game.id} game={game} />
            ))}
        </div>
    )
}
