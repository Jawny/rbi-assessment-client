const CheckWinner = (data) => {
  const { player1, player2, score1, score2 } = data;
  const difference = score1 - score2;
  console.log(data);
  switch (difference) {
    case 20:
      return player1;
      break;
    case 25:
      return player1;
      break;
    case 30:
      return player1;
      break;
    case -20:
      return player2;
      break;
    case -25:
      return player2;
      break;
    case -30:
      return player2;
      break;
    default:
      return null;
      break;
  }
};

export { CheckWinner };
