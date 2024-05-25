import GameItem from './GameItem';

interface GameListProps {
    games: any[];
}

const GameList: React.FC<GameListProps> = ({ games }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.length === 0 ? (
                <p>No games found</p>
            ) : (
                games.map((game) => <GameItem key={game.id} game={game} />)
            )}
        </div>
    );
};

export default GameList;