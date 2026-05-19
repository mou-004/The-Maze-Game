# Maze Escape Game

A simple React-based maze escape game where the player must reach the exit before the time runs out.

## Features

- Random maze generation
- 80-second countdown timer
- Keyboard movement using Arrow keys or WASD
- On-screen movement buttons
- Move counter
- Win and lose conditions
- Responsive screen layout
- Regenerate maze option

## Game Rules

1. The player starts from the red position.
2. The exit is shown in green.
3. The player must reach the green exit before the timer reaches zero.
4. Walls cannot be crossed.
5. If time runs out, the player loses.

## Controls

### Keyboard

- Arrow Up / W = Move Up
- Arrow Down / S = Move Down
- Arrow Left / A = Move Left
- Arrow Right / D = Move Right

### Buttons

- Up
- Down
- Left
- Right
- Regenerate Maze

## Technologies Used

- React
- JavaScript
- CSS
- Vite

### For random maze generation, I used the recursive backtracking algorithm.

First, I create a grid where every cell is a wall. In my code, the wall is represented by the # symbol.

Then I start from the player’s starting position, which is row 1 and column 1. From that position, the algorithm randomly chooses one direction from up, down, left, or right.

The important point is that the algorithm moves two cells at a time. This is because the cell between the current position and the next position works as a wall. When the algorithm moves to a valid new cell, it removes the wall between them and creates a path.

In the code, this part creates the full wall grid:

const maze = Array.from({ length: ROWS }, () => Array(COLS).fill("#"));

Then this function starts carving paths:

function carve(r, c) {
  maze[r][c] = " ";
}

Here, r and c mean the current row and column. The current cell is changed from wall to empty space.

Then I define four possible directions:

const dirs = [
  [0, 2],
  [0, -2],
  [2, 0],
  [-2, 0],
].sort(() => Math.random() - 0.5);

These are right, left, down, and up movements. I use Math.random() to shuffle the directions, so every time the maze becomes different.

After that, the code checks the next cell:

const nr = r + dr;
const nc = c + dc;

Here, nr means new row and nc means new column.

Then I check whether the new cell is inside the maze and still a wall:

if (
  nr > 0 &&
  nr < ROWS - 1 &&
  nc > 0 &&
  nc < COLS - 1 &&
  maze[nr][nc] === "#"
)

If this condition is true, it means the cell is valid and not visited yet.

Then I remove the wall between the current cell and the new cell:

maze[r + dr / 2][c + dc / 2] = " ";

After that, I call the same function again:

carve(nr, nc);

This is why it is called recursive backtracking. The function keeps calling itself and creates paths. If it reaches a dead end, it automatically goes back and tries another direction.

Finally, I place the player and exit:

maze[1][1] = "P";
maze[ROWS - 2][COLS - 2] = "E";

The player starts from P and the exit is E.

The main benefit of this algorithm is that the maze is always solvable, because all paths are created from one starting point. So there will always be a connected route from the player to the exit.

```bash
npm install
npm run dev
