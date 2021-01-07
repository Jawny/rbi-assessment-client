import React, { useState, useEffect } from "react";
import { PlayersScore } from "./components/PlayerScore";
import { CalculateScore, CheckWinner } from "./utils/index";
import "./App.css";
import axios from "axios";

function App() {
  const [playerOneScore, setplayerOneScore] = useState(0);
  const [playerTwoScore, setplayerTwoScore] = useState(0);
  const [winner, setWinner] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [gameId, setGameId] = useState("");

  const postUrl = "http://localhost:8000/post";
  const getUrl = "http://localhost:8000/get";

  const startingData = {
    score1: playerOneScore,
    score2: playerTwoScore,
  };

  useEffect(
    () => {
      getGameData();
    },
    [playerOneScore],
    [playerTwoScore]
  );

  const getGameData = async () => {
    const data = await axios.get(getUrl);
    if (data.data.length < 1) {
      handleStartGame();
    } else {
      setplayerOneScore(data.data[0].score1);
      setplayerTwoScore(data.data[0].score2);
    }

    const gameWinner = CheckWinner(data.data[0]);
    console.log(gameWinner);
    if (gameWinner) {
      setGameOver(true);
      setWinner(gameWinner);
    }
  };

  const handleScore = async (score, setPlayerScore) => {
    const newScore = CalculateScore(score);
    // Determine which player score to update
    setPlayerScore(newScore);

    /*
    if (player == player1) {
      const newScore = CalculateScore(playerOneScore);

      data = {
        player1: player1,
        score1: newScore,
        // player2: player2,
        // score2: playerTwoScore,
      };
    } else if (player == player2) {
      const newScore = CalculateScore(playerTwoScore);

      data = {
        // player1: player1,
        // score1: playerOneScore,
        player2: player2,
        score2: newScore,
      };
    }
    */

    const data = { player, score: newScore };

    console.log(data);
    await axios.post(postUrl, data).then(() => {
      getGameData();
    });
  };

  const handleStartGame = async () => {
    const data = {
      score1: playerOneScore,
      score2: playerTwoScore,
    };

    const gameId = await axios.post(postUrl, data);
    setGameId(gameId["_id"]);
  };

  const handleResetGame = async () => {
    const data = {
      score1: 0,
      score2: 0,
    };

    await axios.post(postUrl, data).then(() => {
      setWinner("");
      setGameOver(false);
    });
  };

  return (
    <div className="App">
      <div className="players-container">
        <PlayersScore
          player="player1"
          score={playerOneScore}
          handleScore={handleScore}
          gameOver={gameOver}
          setPlayerScore={setplayerOneScore}
        />
        <PlayersScore
          player="player2"
          score={playerTwoScore}
          handleScore={handleScore}
          gameOver={gameOver}
        />
        {winner != "" ? <h1>{winner} has won!</h1> : <></>}
      </div>
      <button onClick={handleResetGame}>RESET GAME</button>
      <button onClick={handleStartGame}>sdfsdfsdfsd</button>
    </div>
  );
}

export default App;
