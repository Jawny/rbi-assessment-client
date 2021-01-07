import React, { useState, useEffect } from "react";
import { PlayerScore } from "./components/PlayerScore";
import { CalculateScore, CheckWinner } from "./utils/index";
import "./App.css";
import axios from "axios";

const App = () => {
  const [scores, setScores] = useState([0, 0]);
  const [gameId, setGameId] = useState("");
  const [winner, setWinner] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Use for local development
  // const updateUrl = "http://localhost:8000/update";
  // const readUrl = "http://localhost:8000/";
  // const createUrl = "http://localhost:8000/create";
  // const deleteUrl = "http://localhost:8000/delete";

  const updateUrl = "https://rbi-server.herokuapp.com/update";
  const readUrl = "https://rbi-server.herokuapp.com/";
  const createUrl = "https://rbi-server.herokuapp.com/create";
  const deleteUrl = "https://rbi-server.herokuapp.com/delete";

  // Initialize the game
  useEffect(() => {
    getGameData();
  }, []);

  // Check if the game is over whenever scores are updated
  useEffect(() => {
    handleIfGameOver(scores);
  }, [scores]);

  // Get game data from database, if no game data exists then create a game with scores [0,0]
  const getGameData = async () => {
    const data = await axios.get(readUrl);
    console.log("gamedata", data);
    // Check if the database is empty, if true then create a game with scores [0,0]
    // Else get game[0]'s id and setGameId.
    if (data.data.length < 1) {
      const newGameId = await axios.post(createUrl);
      setGameId(newGameId.data["_id"]);
    } else {
      setGameId(data.data[0]["_id"]);
      setScores(data.data[0].scores);
    }
  };

  // Check if game is over setGameOver to true, and setWinner to winning player
  const handleIfGameOver = (scores) => {
    // Check if either player has won and return 0 for player1 and 1 for player2
    const gameWinner = CheckWinner(scores);
    // Check if gameWinner has been set, null = no winner
    if (gameWinner != null) {
      setGameOver(true);
      gameWinner ? setWinner("Player2") : setWinner("Player1");
    }
  };

  // Calculate new score based on index,
  // Update Scores state and make post request to update database score
  // Check if game is over
  const handleScore = async (index) => {
    // Calculate new score from index and setScores state with new scores
    // index 0 = score1 index 1 = score2
    const newScore = CalculateScore(scores[index]);
    const newScores = index ? [scores[0], newScore] : [newScore, scores[1]];
    setScores(newScores);

    // Update scores in the database
    await axios
      .put(updateUrl, { scores: newScores, id: gameId })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Reset database scores to [0,0], set gameOver state to false and call getGameData to rerender DOM
  const handleResetGame = async () => {
    await axios.put(updateUrl, { scores: [0, 0], id: gameId });
    await setWinner("");
    await setGameOver(false);
    await getGameData();
  };

  return (
    <div>
      <PlayerScore
        player="player1"
        scores={scores}
        index={0}
        handleScore={handleScore}
        gameOver={gameOver}
      />
      <PlayerScore
        player="player2"
        scores={scores}
        index={1}
        handleScore={handleScore}
        gameOver={gameOver}
      />
      {winner != "" ? <h1>{winner} has won!</h1> : <></>}
      <button onClick={handleResetGame}>RESET GAME</button>
    </div>
  );
};

export default App;
