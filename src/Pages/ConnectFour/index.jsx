import React, { useState } from "react";

const ConnectFour = () => {
  const numRows = 6;
  const numCols = 7;

  const [board, setBoard] = useState(
    Array(numRows).fill(Array(numCols).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState("red");
  const [winner, setWinner] = useState(null);

  const checkWin = (board, row, col, player) => {
    const directions = [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: -1 },
    ];

    const countConsecutive = (dirX, dirY) => {
      let count = 0;
      for (let step = -3; step <= 3; step++) {
        const r = row + step * dirY;
        const c = col + step * dirX;
        if (
          r >= 0 &&
          r < numRows &&
          c >= 0 &&
          c < numCols &&
          board[r][c] === player
        ) {
          count++;
          if (count === 4) return true;
        } else {
          count = 0;
        }
      }
      return false;
    };

    return directions.some((dir) => countConsecutive(dir.x, dir.y));
  };

  const handleClick = (col) => {
    if (winner) return;

    const updatedBoard = board.map((row) => row.slice());

    //bosluq axtariram
    for (let row = numRows - 1; row >= 0; row--) {
      if (!updatedBoard[row][col]) {
        updatedBoard[row][col] = currentPlayer;

        if (checkWin(updatedBoard, row, col, currentPlayer)) {
          setWinner(currentPlayer);
        }

        setCurrentPlayer(currentPlayer === "red" ? "blue" : "red");
        setBoard(updatedBoard);
        break;
      }
    }
  };

  const resetGame = () => {
    const response = confirm("Are you sure you want to restart the game?");
    if (!response) return;
    setBoard(Array(numRows).fill(Array(numCols).fill(null)));
    setCurrentPlayer("red");
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100  bg-star text-white" style={{ height: 'calc(100vh - 136px)' }}>
      <h1 className="text-4xl font-bold mb-4">Connect 4</h1>
      <div className="grid grid-cols-7 gap-2">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="w-12 h-12 bg-gray-300 border-2 border-gray-600 flex items-center justify-center cursor-pointer rounded-full"
              onClick={() => handleClick(colIndex)}
            >
              {cell && (
                <div
                  className={`w-8 h-8 rounded-full ${
                    cell === "red" ? "bg-red-500" : "bg-blue-500"
                  }`}
                />
              )}
            </div>
          ))
        )}
      </div>
      {winner ? (
        <div className="mt-4 text-xl font-bold text-green-600">
          {winner.charAt(0).toUpperCase() + winner.slice(1)} wins!
        </div>
      ) : (
        <div className="mt-4 text-xl font-bold">
          Next Player: <span className={currentPlayer === "red" ? "text-red-500" : "text-blue-500"}>{currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}</span>
        </div>
      )}
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700"
      >
        Reset Game
      </button>
    </div>
  );
};

export default ConnectFour;
