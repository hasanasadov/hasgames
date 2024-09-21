import React, { useState } from 'react';

const Sudoku = () => {
    const [size, setSize] = useState(9);
    const [grid, setGrid] = useState(Array(size).fill(Array(size).fill('')));
    const [solution, setSolution] = useState(Array(size).fill(Array(size).fill('')));

    const handleChange = (e, row, col) => {
        const newGrid = grid.map((r, i) => 
            r.map((cell, j) => (i === row && j === col ? e.target.value : cell))
        );
        setGrid(newGrid);
    };

    const handleSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setSize(newSize);
        setGrid(Array(newSize).fill(Array(newSize).fill('')));
        setSolution(Array(newSize).fill(Array(newSize).fill('')));
    };

    const checkSolution = () => {
        // Add logic to check if the current grid matches the solution
        // This is a placeholder for the actual solution checking logic
        alert('Solution checking not implemented yet');
    };

    const solveSudoku = () => {
        // Add logic to solve the Sudoku puzzle
        // This is a placeholder for the actual solving logic
        alert('Sudoku solving not implemented yet');
    };

    return (
        <div className="flex flex-col items-center p-4 bg-star">
            <div className="mb-4">
                <label className="mr-2 text-white">Grid Size:</label>
                <input 
                    type="number" 
                    value={size} 
                    onChange={handleSizeChange} 
                    className="border p-1"
                    min="1"
                    max="16"
                />
            </div>
            <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                {grid.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                        <input 
                            key={`${rowIndex}-${colIndex}`} 
                            type="text" 
                            value={cell} 
                            onChange={(e) => handleChange(e, rowIndex, colIndex)} 
                            className="border p-2 text-center w-12 h-12"
                            maxLength="1"
                            color='white'
                        />
                    ))
                )}
            </div>
            <div className="mt-4">
                <button onClick={checkSolution} className="bg-blue-500 text-white p-2 mr-2">Check Solution</button>
                <button onClick={solveSudoku} className="bg-green-500 text-white p-2">Solve Sudoku</button>
            </div>
        </div>
    );
};

export default Sudoku;