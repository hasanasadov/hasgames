import React, { useState, useEffect } from "react";

const MineField = () => {
  const [size, setSize] = useState(5);
  const [minefield, setMinefield] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const generateMinefield = () => {
    let newMinefield = [];
    for (let i = 0; i < size; i++) {
      let row = [];
      for (let j = 0; j < size; j++) {
        row.push({ mine: Math.random() < 0.2, revealed: false });
      }
      newMinefield.push(row);
    }
    setMinefield(newMinefield);
    setRevealed(
      Array(size)
        .fill()
        .map(() => Array(size).fill(false))
    );
    setGameOver(false);
    setGameStarted(true);
  };

  const handleCellClick = (i, j) => {
    if (minefield[i][j].mine) {
      setGameOver(true);
      alert("Game Over! You hit a mine.");
    } else {
      revealCell(i, j);
    }
  };

  const revealCell = (i, j) => {
    if (revealed[i][j]) return;
    let newRevealed = [...revealed];
    newRevealed[i][j] = true;
    setRevealed(newRevealed);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 3 && value <= 20) {
      setSize(value);
    } else {
      alert("Please enter a value between 3 and 20.");
    }
  };

  const startGame = () => {
    generateMinefield();
  };

  function countAdjacentMines(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newX = x + i;
        const newY = y + j;
        if (
          newX >= 0 &&
          newX < size &&
          newY >= 0 &&
          newY < size &&
          minefield[newX][newY].mine
        ) {
          count++;
        }
      }
    }
    return count;
  }

  return (
    <div
      className="flex flex-col items-center justify-center bg-star"
      style={{ height: "calc(100vh - 136px)" }}
    >
      <h1 className="text-3xl font-bold mb-5 text-white">Minefield Game</h1>
      {!gameStarted && <p className="text-white mb-2" >Set Size</p>}
      {!gameStarted && (
        <div className="mb-4">
          <input
            type="number"
            value={size}
            onChange={handleInputChange}
            className="border border-gray-400 rounded p-2 bg-transparent text-white text-center"
            min="0"
            max="20"
          />
          <button
            onClick={startGame}
            className="ml-2 bg-transparent border text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <div className="flex flex-col ">
          <div
            className={`grid grid-cols-${size} gap-1`}
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {minefield.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleCellClick(i, j)}
                  className={`w-10 h-10 border ${
                    revealed[i][j] ? "bg-gray-300" : "bg-blue-500"
                  } ${
                    gameOver && cell.mine ? "bg-red-500" : ""
                  } flex items-center justify-center text-xl`}
                >
                  {revealed[i][j] && !cell.mine ? countAdjacentMines(i, j) : ""}
                </button>
              ))
            )}
          </div>

          {gameOver && (
            <button
              onClick={() => setGameStarted(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Restart Game
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MineField;
