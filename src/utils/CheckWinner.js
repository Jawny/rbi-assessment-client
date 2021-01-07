const CheckWinner = (scores) => {
  const difference = scores[0] - scores[1];
  switch (difference) {
    case 20:
      return 0;
      break;
    case 25:
      return 0;
      break;
    case 30:
      return 0;
      break;
    case -20:
      return 1;
      break;
    case -25:
      return 1;
      break;
    case -30:
      return 1;
      break;
    default:
      return null;
      break;
  }
};

export { CheckWinner };
