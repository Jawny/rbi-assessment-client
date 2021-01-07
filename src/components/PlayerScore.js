const PlayerScore = (props) => {
  const { player, scores, gameOver, handleScore, index } = props;
  return (
    <div>
      <h1>{player}</h1>
      <h1>{scores[index]}</h1>
      <button
        onClick={() => {
          handleScore(index);
        }}
        disabled={gameOver}
      >
        {player} Scored
      </button>
    </div>
  );
};
export { PlayerScore };
