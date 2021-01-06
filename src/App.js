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

  const postUrl = "http://localhost:8080/post";
  const getUrl = "http://localhost:8080/get";
  const player1 = "player1";
  const player2 = "player2";

  const startingData = [
    {
      player: player1,
      score: playerOneScore,
    },
    {
      player: player2,
      score: playerTwoScore,
    },
  ];

  useEffect(() => {
    getGameData();
  });

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

  const handleScore = async (player) => {
    let data = {};

    if (player == player1) {
      const newScore = CalculateScore(playerOneScore);

      data = {
        player1: player1,
        score1: newScore,
        player2: player2,
        score2: playerTwoScore,
      };
    } else if (player == player2) {
      const newScore = CalculateScore(playerTwoScore);

      data = {
        player1: player1,
        score1: playerOneScore,
        player2: player2,
        score2: newScore,
      };
    }

    await axios.post(postUrl, data).then(() => {
      getGameData();
    });
  };

  const handleStartGame = async () => {
    const data = {
      player1: player1,
      score1: playerOneScore,
      player2: player2,
      score2: playerTwoScore,
    };
    await axios.post(postUrl, data);
  };

  const handleResetGame = async () => {
    const data = {
      player1: player1,
      score1: 0,
      player2: player2,
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
          players={startingData}
          handleScore={handleScore}
          gameOver={gameOver}
        />
        {winner != "" ? <h1>{winner} has won!</h1> : <></>}
      </div>
      <button onClick={handleResetGame}>RESET GAME</button>
    </div>
  );
}

export default App;
