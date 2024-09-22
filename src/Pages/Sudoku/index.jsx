import React, { useState } from "react";

const initialBoard = [
  [5, 3, "", "", 7, "", "", "", ""],
  [6, "", "", 1, 9, 5, "", "", ""],
  ["", 9, 8, "", "", "", "", 6, ""],
  [8, "", "", "", 6, "", "", "", 3],
  [4, "", "", 8, "", 3, "", "", 1],
  [7, "", "", "", 2, "", "", "", 6],
  ["", 6, "", "", "", "", 2, 8, ""],
  ["", "", "", 4, 1, 9, "", "", 5],
  ["", "", "", "", 8, "", "", 7, 9],
];
const stringBoard = initialBoard.map((row) =>
  row.map((cell) => (typeof cell === "number" ? cell.toString() : cell))
);

const Sudoku = () => {
  const [board, setBoard] = useState(stringBoard);
  const [isSolved, setIsSolved] = useState(false);
  const [isError, setIsError] = useState(false);
  const handleChange = (e, rowIndex, colIndex) => {
    setIsError(false);
    const value = e.target.value;
    if (value === "" || (value >= 1 && value <= 9)) {
      const newBoard = board.map((r, i) =>
        r.map((cell, j) => (i === rowIndex && j === colIndex ? value : cell))
      );
      setBoard(newBoard);
    }
    validateMove(rowIndex, colIndex, value);
    if (isSolvedBoard()) {
      setIsSolved(true);
    }
  };

  const validateMove = (rowIndex, colIndex, value) => {
    const row = board[rowIndex];
    if (value === "") return;
    if (row.includes(value)) {
      setIsError(true);
    }
    const column = board.map((r) => r[colIndex]);
    if (column.includes(value)) {
      setIsError(true);
    }
    const box = [];
    const startRow = Math.floor(rowIndex / 3) * 3;
    const startCol = Math.floor(colIndex / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        box.push(board[i][j]);
      }
    }
    if (box.includes(value)) {
      setIsError(true);
    }
  };

  const isSolvedBoard = () => {
    if (isError) return;
    for (let i = 0; i < 9; i++) {
      const row = board[i];
      const column = board.map((r) => r[i]);
      if (
        new Set(row).size !== 9 ||
        new Set(column).size !== 9 ||
        new Set(getBox(i)).size !== 9
      ) {
        return false;
      }
    }
    return true;
  };

  const getBorderClass = (rowIndex, colIndex) => {
    let classes = "w-10 h-10 text-center border border-gray-400  outline-none";
    if (rowIndex % 3 === 0) classes += " border-t-4";
    if (colIndex % 3 === 0) classes += " border-l-4";
    if (rowIndex === 8) classes += " border-b-4";
    if (colIndex === 8) classes += " border-r-4";
    if (isError) classes += " border-red-500";
    if (isSolved) classes += " border-green-500";
    return classes;
  };

  return (
    <div
      className="flex justify-center items-center bg-star  bg-gray-100"
      style={{ height: "calc(100vh - 136px)" }}
    >
      <div className="grid grid-cols-9 p-4 gap-0 bg-star">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              value={cell}
              onChange={(e) => handleChange(e, rowIndex, colIndex)}
              className={getBorderClass(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Sudoku;
