import React, { useState, useEffect, useRef } from "react";

const difficulties = {
  easy: 1000,
  medium: 600,
  hard: 300,
};

const Click = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");
  const [score, setScore] = useState(0);
  const [dotPosition, setDotPosition] = useState({ top: 0, left: 0 });
  const [gamers, setGamers] = useState([]);
  const [username, setUsername] = useState("");
  const timerRef = useRef(null);
  const gameDuration = 10;
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      setTimeLeft(gameDuration);

      countdownRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdownRef.current);
            handleStop();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      timerRef.current = setInterval(() => {
        generateRandomDot();
      }, difficulties[difficulty]);

      return () => {
        clearInterval(timerRef.current);
        clearInterval(countdownRef.current);
      };
    }
  }, [isPlaying, difficulty]);

  const generateRandomDot = () => {
    const top = Math.random() * 90 + "%";
    const left = Math.random() * 90 + "%";
    setDotPosition({ top, left });
  };

  const handleStart = () => {
    const user = prompt("Please enter your name:");
    if (user) {
      setUsername(user);
      setScore(0);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    clearInterval(timerRef.current);
    clearInterval(countdownRef.current);
    setIsPlaying(false);

    if (username) {
      setGamers((prevGamers) => [
        ...prevGamers,
        { name: username, point: score },
      ]);
    }
  };

  const handleDotClick = () => {
    if (isPlaying) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center pt-5 bg-gray-100 bg-star text-white">
      <h1 className="text-3xl mb-4 font-bold">Click the dot</h1>
      <div className="flex flex-col items-center">
        <div className="flex mb-4">
          <button
            onClick={handleStart}
            className="bg-green-600 px-4 py-2 m-1 border"
          >
            START
          </button>
          <button
            onClick={handleStop}
            className="bg-red-600 px-4 py-2 m-1 border"
          >
            STOP
          </button>
        </div>

        <div className="flex mb-4">
          <button
            onClick={() => setDifficulty("easy")}
            className={`px-4 py-2 m-1 border ${
              difficulty === "easy" ? "border-green-600" : ""
            }`}
          >
            EASY
          </button>
          <button
            onClick={() => setDifficulty("medium")}
            className={`px-4 py-2 m-1 border ${
              difficulty === "medium" ? "border-green-600" : ""
            }`}
          >
            MEDIUM
          </button>
          <button
            onClick={() => setDifficulty("hard")}
            className={`px-4 py-2 m-1 border ${
              difficulty === "hard" ? "border-green-600" : ""
            }`}
          >
            HARD
          </button>
        </div>

        <div className="border p-4 mb-4 w-64 text-center">
          <p className="text-red-500">Score: {score}</p>
          <p className="text-gray-500">Time Left: {timeLeft} s</p>
        </div>

        <div
          className="relative border bg-star"
          style={{ width: "300px", height: "300px" }}
        >
          {isPlaying && (
            <div
              onClick={handleDotClick}
              className="bg-white rounded-full absolute"
              style={{
                width: "20px",
                height: "20px",
                top: dotPosition.top,
                left: dotPosition.left,
                cursor: "pointer",
              }}
            />
          )}
        </div>

        <div className="mt-4">
          <table className="table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {gamers.map((gamer, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{gamer.name}</td>
                  <td className="border px-4 py-2">{gamer.point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Click;
