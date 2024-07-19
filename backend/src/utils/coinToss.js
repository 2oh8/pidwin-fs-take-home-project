const coinToss = (userGuess) => {
    const outcome = Math.floor(Math.random() * 2) === 0 ? "heads" : "tails";
    const userWonCoinToss = userGuess.toLowerCase() === outcome;
    
    return {
      outcome,
      userWonCoinToss
    };
  }

  export default coinToss