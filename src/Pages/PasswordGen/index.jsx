import React, { useState } from "react";

const PasswordGen = () => {
  const [length, setLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeLowercase, setIncludeLowercase] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [password, setPassword] = useState("");

  const generatePassword = () => {
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

    let charSet = "";
    if (includeUppercase) charSet += upperCaseChars;
    if (includeLowercase) charSet += lowerCaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;


    if (charSet === "") {
        alert("Please select at least one character set to generate password");
        setPassword("");
        return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      generatedPassword += charSet[randomIndex];
    }

    setPassword(generatedPassword);
  };

  const [copySuccess, setCopySuccess] = useState("Copy");

  const handleCopy = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess("Copy"), 1000);
    });
  };

  return (
    <div className="flex flex-col items-center p-4 bg-star text-red-50 ">
      <h1 className="text-2xl font-bold mb-4">Password Generator</h1>
      <div className="flex flex-col items-start justify-center p-4">
        <div className="mb-4">
          <label className="block mb-2">
            Password Length:
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              min="1"
              className="ml-2 p-1 border rounded bg-inherit"
            />
          </label>
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="mr-2"
            />
            Include Uppercase Letters
          </label>
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="mr-2"
            />
            Include Lowercase Letters
          </label>
        </div>
        <div className="mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="mr-2"
            />
            Include Symbols
          </label>
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="mr-2"
            />
            Include Numbers
          </label>
        </div>
        <button
          onClick={generatePassword}
          className="bg-blue-500 text-white w-full px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Password
        </button>
        <div className="mt-4 flex items-center justify-between w-full ">
          <h2 className="text-xl font-semibold mr-2">Generated Password:</h2>
          <p className="p-2 border rounded mr-2">{password}</p>
          <button
            onClick={handleCopy}
            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            {copySuccess}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGen;
