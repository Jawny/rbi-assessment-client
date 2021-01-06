const PlayersScore = (props) => {
  const { players, handleScore, gameOver } = props;
  return players.map((player) => {
    return (
      <div>
        <h1>{player.player}</h1> <h1>{player.score}</h1>{" "}
        <button
          onClick={() => {
            handleScore(player.player);
          }}
          disabled={gameOver}
        >
          {player.player} Scored
        </button>
      </div>
    );
  });
};
export { PlayersScore };
