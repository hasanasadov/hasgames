import React, {  useState } from "react";

const Tic_Tac_Toe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board)) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const restartGame = () => {
    const response = confirm("Are you sure you want to restart the game?");
    if (!response) return;
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${isXNext ? "X" : "O"}`;

  return (
    <div className="flex items-center justify-center  gap-4  bg-star text-white flex-col" style={{ height: "calc(100vh - 136px)" }}>
      <div className="text-6xl font-bold mb-4">Tic Tac Toe</div>
      <div className="flex flex-col">
        <div className="status text-center mb-4 font-bold text-2xl text-red-600">
          {status}
        </div>
        <div className="grid grid-cols-3 gap-4 w-80 h-w-80">
          {board.map((value, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className="bg-slate-600 w-full h-full font-bold text-7xl uppercase"
              style={{ height: "96px" }}
            >
              {value}
            </button>
          ))}
        </div>
        <button
          onClick={restartGame}
          className="mt-4 bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default Tic_Tac_Toe;
