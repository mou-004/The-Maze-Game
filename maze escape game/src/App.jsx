import React, { useEffect, useState } from "react";
import "./App.css";

const ROWS = 31;
const COLS = 31;

function generateMaze() {
  const maze = Array.from({ length: ROWS }, () => Array(COLS).fill("#"));

  function carve(r, c) {
    maze[r][c] = " ";

    const dirs = [
      [0, 2],
      [0, -2],
      [2, 0],
      [-2, 0],
    ].sort(() => Math.random() - 0.5);

    for (let [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;

      if (
        nr > 0 &&
        nr < ROWS - 1 &&
        nc > 0 &&
        nc < COLS - 1 &&
        maze[nr][nc] === "#"
      ) {
        maze[r + dr / 2][c + dc / 2] = " ";
        carve(nr, nc);
      }
    }
  }

  carve(1, 1);

  maze[1][1] = "P";
  maze[ROWS - 2][COLS - 2] = "E";

  return maze.map((row) => row.join(""));
}

function App() {
  const [maze, setMaze] = useState(generateMaze());
  const [player, setPlayer] = useState({ row: 1, col: 1 });
  const [timeLeft, setTimeLeft] = useState(120);
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

  const movePlayer = (dir) => {
    if (status !== "playing") return;

    let r = player.row;
    let c = player.col;

    if (dir === "up") r--;
    if (dir === "down") r++;
    if (dir === "left") c--;
    if (dir === "right") c++;

    if (
      r >= 0 &&
      r < maze.length &&
      c >= 0 &&
      c < maze[0].length &&
      maze[r][c] !== "#"
    ) {
      setPlayer({ row: r, col: c });
      setMoves((m) => m + 1);

      if (maze[r][c] === "E") {
        setStatus("won");
      }
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") movePlayer("up");
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") movePlayer("down");
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") movePlayer("left");
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") movePlayer("right");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const restartGame = () => {
    setMaze(generateMaze());
    setPlayer({ row: 1, col: 1 });
    setTimeLeft(120);
    setStatus("playing");
    setMoves(0);
  };

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="app">
      <h1>The Maze Game</h1>
      <p>Find the exit before time ends.</p>

      <h2>Time Left: {formatTime()}</h2>
      <h3>Moves: {moves}</h3>

      <div
        className="maze"
        style={{ gridTemplateColumns: `repeat(${COLS}, 18px)` }}
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
        <button onClick={restartGame}>Regenerate Maze</button>
      </div>
    </div>
  );
}

export default App;