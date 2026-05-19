import React, { useEffect, useState } from "react";
import "./App.css";

const GAME_TIME = 40;

const maze = [
  "#####################",
  "#P    #       #     #",
  "##### # ##### # ### #",
  "#     #     # # #   #",
  "# ######### # # # ###",
  "# #       # #   #   #",
  "# # ##### # ####### #",
  "# # #   # #       # #",
  "# # # # # ####### # #",
  "#   # # #       #   #",
  "##### # ####### ### #",
  "#     #       #     #",
  "# ########### ##### #",
  "#       #     #     #",
  "####### # ##### ### #",
  "#       #       #   #",
  "# ############# # ###",
  "#               #  E#",
  "#####################",
];

function App() {
  const [player, setPlayer] = useState({ row: 1, col: 1 });
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [status, setStatus] = useState("playing");
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (status !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus("lost");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const movePlayer = (direction) => {
    if (status !== "playing") return;

    let newRow = player.row;
    let newCol = player.col;

    if (direction === "up") newRow--;
    if (direction === "down") newRow++;
    if (direction === "left") newCol--;
    if (direction === "right") newCol++;

    if (
      newRow >= 0 &&
      newRow < maze.length &&
      newCol >= 0 &&
      newCol < maze[0].length &&
      maze[newRow][newCol] !== "#"
    ) {
      setPlayer({ row: newRow, col: newCol });
      setMoves((prev) => prev + 1);

      if (maze[newRow][newCol] === "E") {
        setStatus("won");
      }
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();

      if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)
      ) {
        e.preventDefault();
      }

      if (e.key === "ArrowUp" || key === "w") movePlayer("up");
      if (e.key === "ArrowDown" || key === "s") movePlayer("down");
      if (e.key === "ArrowLeft" || key === "a") movePlayer("left");
      if (e.key === "ArrowRight" || key === "d") movePlayer("right");
    };

    window.addEventListener("keydown", handleKey, { passive: false });
    return () => window.removeEventListener("keydown", handleKey);
  }, [player, status]);

  const restartGame = () => {
    setPlayer({ row: 1, col: 1 });
    setTimeLeft(GAME_TIME);
    setStatus("playing");
    setMoves(0);
  };

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="game-container">
      <h1>The Maze Game</h1>
      <p>A fixed-map maze escape game for beginners.</p>

      <div className="info">
        <h2>Time Left: {formatTime()}</h2>
        <h3>Moves: {moves}</h3>
      </div>

      <div
        className="maze"
        style={{ gridTemplateColumns: `repeat(${maze[0].length}, 1fr)` }}
      >
        {maze.map((row, rowIndex) =>
          row.split("").map((cell, colIndex) => {
            let className = "cell";

            if (cell === "#") className += " wall";
            if (cell === "E") className += " exit";

            if (player.row === rowIndex && player.col === colIndex) {
              className += " player";
            }

            return <div key={`${rowIndex}-${colIndex}`} className={className}></div>;
          })
        )}
      </div>

      {status === "won" && <h2 className="win">You Escaped!</h2>}
      {status === "lost" && <h2 className="lose">Time Over! You Lost.</h2>}

      <div className="controls">
        <button onClick={() => movePlayer("up")}>Up</button>
        <div>
          <button onClick={() => movePlayer("left")}>Left</button>
          <button onClick={() => movePlayer("down")}>Down</button>
          <button onClick={() => movePlayer("right")}>Right</button>
        </div>
        <button onClick={restartGame}>Restart Game</button>
      </div>
    </div>
  );
}

export default App;
