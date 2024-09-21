import React from "react";
import { Link } from "react-router-dom";
import Tic_Tac_Img from "../../assets/tictac.png";
import MineField_Img from "../../assets/minefield.png";
import Sudoku_Img from "../../assets/sudoku.png";
import Click_Img from "../../assets/click.png";

const HomePage = () => {
  return (
    <div className="flex flex-col p-8 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4 max-w-6xl">Select a Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <Link
          to="/Tic_Tac_Toe"
          className="bg-primary text-white p-4 rounded-md block text-center w-full"
        >
          <div className="flex flex-col justify-between h-full gap-4 w-full">
            <img className="w-full h-full" src={Tic_Tac_Img} alt="Tic Tac Toe" />
            <h2 className="text-4xl font-semibold">Tic Tac Toe</h2>
          </div>
        </Link>
        <Link
          to="/MineField"
          className="bg-primary text-white p-4 rounded-md block text-center"
        >
          <div className="flex flex-col justify-between h-full gap-4">
            <img className="w-full h-full" src={MineField_Img} alt="Mine Field" />
            <h2 className="text-4xl font-semibold">Mine Field</h2>
          </div>
        </Link>
        <Link
          to="/Sudoku"
          className="bg-primary text-white p-4 rounded-md block text-center"
        >
          <div className="flex flex-col justify-between h-full gap-4">
            <img className="w-full h-full" src={Sudoku_Img} alt="Sudoku" />
            <h2 className="text-4xl font-semibold">Sudoku</h2>
          </div>
        </Link>
        <Link
          to="/Click"
          className="bg-primary text-white p-4 rounded-md block text-center"
        >
          <div className="flex flex-col justify-between h-full gap-4 ">
            <img className="w-full h-full" src={Click_Img} alt="Click" />
            <h2 className="text-4xl font-semibold">Click test</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
