import React, { useState } from 'react';

// Function to generate the board with random mines
const generateBoard = (size, mineCount) => {
  const board = Array(size).fill().map(() => Array(size).fill({ value: 0, revealed: false }));

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    if (board[row][col].value !== 'M') {
      board[row][col] = { value: 'M', revealed: false };
      minesPlaced++;
      // Increment numbers around the mine
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;
          if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && board[newRow][newCol].value !== 'M') {
            board[newRow][newCol].value += 1;
          }
        }
      }
    }
  }

  return board;
};

const Minefield = () => {
  const size = 8; // 8x8 board
  const mineCount = 10;
  const [board, setBoard] = useState(generateBoard(size, mineCount));
  const [gameOver, setGameOver] = useState(false);

  const revealCell = (row, col) => {
    if (gameOver || board[row][col].revealed) return;

    const newBoard = board.map(r => r.map(cell => ({ ...cell })));
    newBoard[row][col].revealed = true;

    if (newBoard[row][col].value === 'M') {
      setGameOver(true); // Game over if a mine is revealed
    } else if (newBoard[row][col].value === 0) {
      // If an empty cell is revealed, clear surrounding empty cells
      revealEmptyCells(newBoard, row, col);
    }

    setBoard(newBoard);
  };

  const revealEmptyCells = (board, row, col) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],        [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && !board[newRow][newCol].revealed) {
        board[newRow][newCol].revealed = true;
        if (board[newRow][newCol].value === 0) {
          revealEmptyCells(board, newRow, newCol); // Recursively reveal empty cells
        }
      }
    });
  };

  const resetGame = () => {
    setBoard(generateBoard(size, mineCount));
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center bg-star ">
      <h1 className="text-4xl font-bold mb-4 text-white">Minefield</h1>
      <div className="grid grid-cols-8 gap-1">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-10 h-10 border-2 rounded-md flex items-center justify-center 
              ${cell.revealed ? 'bg-gray-300' : 'bg-gray-700'} 
              ${cell.revealed && cell.value === 'M' ? 'bg-red-500' : ''}`}
              onClick={() => revealCell(rowIndex, colIndex)}
            >
              {cell.revealed && cell.value !== 0 && cell.value !== 'M' && <span>{cell.value}</span>}
              {cell.revealed && cell.value === 'M' && '💣'}
            </div>
          ))
        )}
      </div>
      {gameOver && <div className="mt-4 text-red-600 text-xl">Game Over! You hit a mine.</div>}
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
      >
        Reset Game
      </button>
    </div>
  );
};

export default Minefield;
