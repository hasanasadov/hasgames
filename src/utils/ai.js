import { empties } from "./game";

// Sadə, rekursiyasız AI: win → block → center → corners → sides
export function smartMove(board, ai, human) {
  const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, c, d] of LINES) {
    const line = [board[a], board[c], board[d]];
    const idxs = [a, c, d];
    if (line.filter((v) => v === ai).length === 2 && line.includes(null)) {
      return idxs[line.indexOf(null)];
    }
  }
  for (const [a, c, d] of LINES) {
    const line = [board[a], board[c], board[d]];
    const idxs = [a, c, d];
    if (line.filter((v) => v === human).length === 2 && line.includes(null)) {
      return idxs[line.indexOf(null)];
    }
  }
  if (board[4] == null) return 4;
  const corners = [0, 2, 6, 8].filter((i) => board[i] == null);
  if (corners.length)
    return corners[Math.floor(Math.random() * corners.length)];
  const sides = [1, 3, 5, 7].filter((i) => board[i] == null);
  return sides.length ? sides[Math.floor(Math.random() * sides.length)] : null;
}

export function pickAi(board, ai, human, diff = "smart") {
  const e = empties(board);
  if (!e.length) return null;
  if (diff === "easy") return e[Math.floor(Math.random() * e.length)];
  return smartMove(board, ai, human);
}
