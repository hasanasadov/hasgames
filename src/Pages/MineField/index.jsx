import React, { useState } from 'react';

const generateBoard = (rows, cols, mines) => {
    const board = Array(rows).fill().map(() => Array(cols).fill({ mine: false, revealed: false, flagged: false }));
    let placedMines = 0;

    while (placedMines < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);

        if (!board[row][col].mine) {
            board[row][col].mine = true;
            placedMines++;
        }
    }

    return board;
};

const MineField = () => {
    const [board, setBoard] = useState(generateBoard(10, 10, 10));
    const [gameOver, setGameOver] = useState(false);

    const revealCell = (row, col) => {
        if (gameOver || board[row][col].revealed || board[row][col].flagged) return;

        const newBoard = board.slice();
        newBoard[row][col].revealed = true;

        if (newBoard[row][col].mine) {
            setGameOver(true);
            alert('Game Over!');
        } else {
            setBoard(newBoard);
        }
    };

    const flagCell = (row, col, e) => {
        e.preventDefault();
        if (gameOver || board[row][col].revealed) return;

        const newBoard = board.slice();
        newBoard[row][col].flagged = !newBoard[row][col].flagged;
        setBoard(newBoard);
    };

    return (
        <div className="minefield bg-star">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, colIndex) => (
                        <div
                            key={colIndex}
                            className={`cell ${cell.revealed ? 'revealed' : ''} ${cell.flagged ? 'flagged' : ''}`}
                            onClick={() => revealCell(rowIndex, colIndex)}
                            onContextMenu={(e) => flagCell(rowIndex, colIndex, e)}
                        >
                            {cell.revealed && cell.mine ? '💣' : ''}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MineField;