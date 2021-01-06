const CalculateScore = (currentScore) => {
  if (currentScore < 30) {
    return currentScore + 15;
  } else {
    return currentScore + 10;
  }
};

export { CalculateScore };
